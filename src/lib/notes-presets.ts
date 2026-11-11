import type { Chunk } from './chunks';
import type { Problem } from './types';
import catalog from '../../content/apuntes/cpp/catalogo.json';
import {
  TEMPLATE_ID, parseStoredSelection, sanitizeSelection,
  type Selection,
} from './composition';

export const NOTES_CONFIG_KEY = 'algoritmia:notes:v2';
export const LEGACY_NOTES_CONFIG_KEY = 'algoritmia:notes:v1';
export const NOTES_MODES = ['recomendado', 'completo', 'funciones', 'personalizado'] as const;
export type NotesMode = (typeof NOTES_MODES)[number];
export type AutomaticMode = Exclude<NotesMode, 'personalizado'>;
export interface NotesPreferences {
  mode: NotesMode;
  // null means that no custom draft exists yet; {} is an intentional empty draft.
  custom: Selection | null;
}

export const NOTES_LEVELS = ['Inicial', 'Consolidación', 'Salto regional'] as const;
export type NotesLevel = (typeof NOTES_LEVELS)[number];
type NotesProblem = Pick<Problem, 'chunkIds' | 'coverage' | 'difficulty'>;
export const BASIC_CHUNK_IDS = ['cpp-variables', 'cpp-entrada-salida', 'cpp-condiciones', 'cpp-recorridos', 'cpp-cuentas-enteras'];
const containerIds = new Set(catalog.groups.find(group => group.id === 'contenedores')!.chunks);

export function supportsAutomaticNotes(problem: Pick<Problem, 'coverage' | 'difficulty'>): boolean {
  return problem.coverage !== 'fuera de alcance' && NOTES_LEVELS.some(level => level === problem.difficulty);
}

export function notesLevel(problems: NotesProblem[]): NotesLevel | null {
  return NOTES_LEVELS.find(level => problems.some(problem => supportsAutomaticNotes(problem) && problem.difficulty === level)) ?? null;
}

export function recommendedChunkIds(problems: NotesProblem[]): string[] {
  const level = notesLevel(problems);
  if (!level) return [];
  const ids = [...new Set(problems.filter(supportsAutomaticNotes).flatMap(problem => problem.chunkIds))];
  return level === 'Inicial'
    ? [...new Set([...BASIC_CHUNK_IDS, ...ids])]
    : ids.filter(id => !BASIC_CHUNK_IDS.includes(id));
}

/** Undefined level preserves free-builder defaults; null means unsupported selected problems. */
export function presetSelection(mode: AutomaticMode, ids: string[], chunks: Pick<Chunk, 'id'>[], level?: NotesLevel | null): Selection {
  const allowed = new Set(chunks.map(chunk => chunk.id));
  const off = { descripcion:false, operaciones:false, ejemplos:false };
  if (level === null) return { [TEMPLATE_ID]:off };
  const selection: Selection = {};
  for (const id of ids) {
    if (id === TEMPLATE_ID || !allowed.has(id)) continue;
    const referenceOnly = mode === 'funciones' || (mode === 'recomendado' && level === 'Salto regional' && containerIds.has(id));
    selection[id] = {
      descripcion: !referenceOnly,
      operaciones: true,
      ejemplos: mode === 'completo' || (mode === 'recomendado' && level !== undefined && !referenceOnly),
    };
  }
  const explainTemplate = mode === 'completo' || (mode === 'recomendado' && level === 'Inicial');
  selection[TEMPLATE_ID] = level === 'Salto regional' ? off : { descripcion:explainTemplate, operaciones:explainTemplate, ejemplos:true };
  return selection;
}

export function activeNotesSelection(preferences: NotesPreferences, ids: string[], chunks: Pick<Chunk, 'id'>[], level?: NotesLevel | null): Selection {
  return preferences.mode === 'personalizado'
    ? preferences.custom ?? {}
    : presetSelection(preferences.mode, ids, chunks, level);
}

export function switchNotesMode(preferences: NotesPreferences, mode: NotesMode, current: Selection): NotesPreferences {
  return { mode, custom: mode === 'personalizado' && preferences.custom === null ? current : preferences.custom };
}

export function restoreNotesPreferences(raw: string | null, legacyRaw: string | null, chunks: Pick<Chunk, 'id'>[], problemIds: string[] = []): NotesPreferences {
  if (problemIds.length) return { mode: 'recomendado', custom: null };
  try {
    const stored = JSON.parse(raw ?? 'null');
    if (stored?.version === 2 && NOTES_MODES.includes(stored.mode)
      && (stored.custom === null || (stored.custom && typeof stored.custom === 'object' && !Array.isArray(stored.custom)))) {
      return { mode: stored.mode, custom: stored.custom === null ? null : sanitizeSelection(stored.custom, chunks) };
    }
  } catch { /* Try the previous format before using defaults. */ }
  const legacy = parseStoredSelection(legacyRaw, chunks);
  return legacy !== null
    ? { mode: 'personalizado', custom: legacy }
    : { mode: 'recomendado', custom: null };
}

export function serializeNotesPreferences(preferences: NotesPreferences): string {
  return JSON.stringify({ version: 2, ...preferences });
}
