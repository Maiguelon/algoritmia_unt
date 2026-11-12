import type { D1Database, Fetcher, EventContext } from '@cloudflare/workers-types';
import { codeforcesGymSubmitUrl, findCodeforcesHandle } from '../../../src/lib/codeforces';
import { notesLevel, presetSelection, recommendedChunkIds } from '../../../src/lib/notes-presets';
import { simulacroPhase, type SimulacroAnnouncement, type SimulacroEntry, type SimulacroEvent } from '../../../src/lib/simulacro-event';
import type { Chunk } from '../../../src/lib/chunks';
import type { Problem, Tournament } from '../../../src/lib/types';

type Env = { SIMULACROS_DB: D1Database; ASSETS: Fetcher };
type EventRow = { id: string; title: string; starts_at: number; ends_at: number; problem_ids: string };

function json(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function readAsset<T>(assets: Fetcher, origin: string, path: string): Promise<T> {
  const response = await assets.fetch(origin + path);
  if (!response.ok) throw new Error('No se pudo abrir ' + path);
  return response.json<T>();
}

async function material(env: Env, origin: string, ids: string[], kind: string) {
  const { problems, tournaments } = await readAsset<{ problems: Problem[]; tournaments: Tournament[] }>(
    env.ASSETS, origin, '/material/catalogo.json',
  );
  const selected = ids.map(id => {
    const problem = problems.find(item => item.id === id);
    if (!problem?.statementUrl || !problem.judgeUrl) throw new Error('Material incompleto para ' + id);
    const judgeUrl = codeforcesGymSubmitUrl(problem.judgeUrl);
    if (!judgeUrl) throw new Error('No hay envío en Codeforces para ' + id);
    return { ...problem, judgeUrl };
  });

  if (kind === 'apunte') {
    const { chunks } = await readAsset<{ chunks: Chunk[] }>(env.ASSETS, origin, '/material/apuntes.json');
    const selection = presetSelection('recomendado', recommendedChunkIds(selected), chunks, notesLevel(selected));
    return json({ selection, chunks: chunks.filter(chunk => chunk.id in selection) });
  }

  return json({
    problems: selected.map(({ id, tournamentId, title, statementUrl, sourceUrl, judgeUrl, letter }, index) => ({
      id, tournamentId, title, statementUrl, sourceUrl, judgeUrl, sourceLetter: letter,
      letter: String.fromCharCode(65 + index),
    })),
    tournaments: tournaments.filter(tournament => selected.some(problem => problem.tournamentId === tournament.id)),
  });
}

export async function onRequest({ request, env, params }: Pick<EventContext<Env, 'id', Record<string, unknown>>, 'request' | 'env' | 'params'>) {
  if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Método inválido.' }, 405);
  if (!env.SIMULACROS_DB) return json({ error: 'El registro todavía no está habilitado.' }, 503);
  const db = env.SIMULACROS_DB;
  try {
    if (params.id === 'proximo') {
      if (request.method !== 'GET') return json({ error: 'Método inválido.' }, 405);
      const now = Date.now();
      const next = await db.prepare(`
        SELECT id, title, starts_at, ends_at FROM simulacros
        WHERE ends_at > ? AND id NOT LIKE 'ensayo%'
        ORDER BY starts_at, id LIMIT 1
      `).bind(now).first<Omit<EventRow, 'problem_ids'>>();
      if (!next) return json(null);
      const announcement: SimulacroAnnouncement = {
        id: next.id, title: next.title, startsAt: next.starts_at, endsAt: next.ends_at,
        serverNow: now, phase: now < next.starts_at ? 'before' : 'live',
      };
      return json(announcement);
    }
    const event = await db.prepare('SELECT * FROM simulacros WHERE id = ?').bind(params.id).first<EventRow>();
    if (!event) return json({ error: 'No encontramos esa edición del simulacro.' }, 404);
    const url = new URL(request.url);
    const ids: string[] = JSON.parse(event.problem_ids);
    const now = Date.now();
    const phase = simulacroPhase(event.starts_at, event.ends_at, now);
    if (request.method === 'GET') {
      const kind = url.searchParams.get('material');
      if (kind !== null) {
        if (kind === 'enunciados' && phase === 'before') return json({ error: 'Los enunciados se habilitan al empezar.' }, 403);
        if (kind !== 'enunciados' && kind !== 'apunte') return json({ error: 'Material inválido.' }, 400);
        return await material(env, url.origin, ids, kind);
      }
      const { results } = await db.prepare(
        'SELECT name, handle FROM simulacro_entries WHERE event_id = ? ORDER BY registered_at, handle',
      ).bind(event.id).all<SimulacroEntry>();
      const state: SimulacroEvent = {
        id: event.id, title: event.title, startsAt: event.starts_at, endsAt: event.ends_at,
        serverNow: now, phase, problemCount: ids.length, entries: results,
      };
      return json(state);
    }
    if (phase !== 'before') return json({ error: 'La inscripción ya cerró.' }, 409);

    let payload: { name?: unknown; handle?: unknown } | null;
    try { payload = await request.json(); }
    catch { return json({ error: 'Revisá los datos de inscripción.' }, 400); }
    const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
    const handle = typeof payload?.handle === 'string' ? payload.handle.trim().toLowerCase() : '';
    if (!name || name.length > 45 || !/^[a-z0-9_.-]{1,48}$/.test(handle)) {
      return json({ error: 'Revisá el nombre y escribí el usuario de Codeforces sin espacios.' }, 400);
    }
    const exists = await db.prepare(
      'SELECT 1 FROM simulacro_entries WHERE event_id = ? AND handle = ?',
    ).bind(event.id, handle).first();
    if (exists) return json({ error: 'Ese usuario de Codeforces ya está anotado en este simulacro.' }, 409);

    let currentHandle: string | null;
    try { currentHandle = await findCodeforcesHandle(handle); }
    catch { return json({ error: 'No pudimos consultar Codeforces. Volvé a intentar en unos segundos.' }, 503); }
    if (!currentHandle) return json({ error: 'No encontramos ese usuario en Codeforces. Revisá cómo está escrito.' }, 422);

    const entry = { name, handle: currentHandle };
    const inserted = await db.prepare(`
      INSERT INTO simulacro_entries (event_id, handle, name, registered_at)
      SELECT id, ?, ?, ? FROM simulacros
      WHERE id = ? AND starts_at > (unixepoch('subsec') * 1000)
      ON CONFLICT (event_id, handle) DO NOTHING
    `).bind(entry.handle, entry.name, Date.now(), event.id).run();
    if (!inserted.meta.changes) {
      const error = Date.now() >= event.starts_at ? 'La inscripción ya cerró.' : 'Ese usuario de Codeforces ya está anotado en este simulacro.';
      return json({ error }, 409);
    }
    return json(entry, 201);
  } catch (error) {
    console.error('Simulacro:', error);
    return json({ error: 'No pudimos cargar el simulacro. Volvé a intentar en unos segundos.' }, 503);
  }
}
