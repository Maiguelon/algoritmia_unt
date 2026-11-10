import { useEffect, useMemo, useRef, useState } from 'react';
import type { Chunk } from '../lib/chunks';
import type { Problem, Tournament } from '../lib/types';
import StatementDownload from './StatementDownload';
import { useSelection, SELECTION_KEY } from '../lib/selection';
import { readSelected } from '../lib/catalog';
import {
  activeNotesSelection, LEGACY_NOTES_CONFIG_KEY, NOTES_CONFIG_KEY,
  recommendedChunkIds, restoreNotesPreferences, serializeNotesPreferences, switchNotesMode,
  type NotesMode, type NotesPreferences,
} from '../lib/notes-presets';
import {
  TEMPLATE_ID, SECTION_KEYS, SECTION_LABELS, addSuggestedSelection, defaultSections,
  hasAnySection, hasIndex, selectedContentChunks,
  suggestedPrerequisites,
  type SectionKey, type Selection,
} from '../lib/composition';

const OFF = { descripcion: false, operaciones: false, ejemplos: false };
const MODES: Array<{ id: NotesMode; title: string; description: string }> = [
  { id: 'recomendado', title: 'Recomendado', description: 'Descripción y funciones.' },
  { id: 'completo', title: 'Completo', description: 'Descripción, funciones y ejemplos.' },
  { id: 'funciones', title: 'Solo funciones', description: 'Funciones y operaciones.' },
  { id: 'personalizado', title: 'Personalizado', description: 'Elegí los bloques y sus partes.' },
];

export default function NotesBuilder({ chunks, problems, tournaments }: { chunks: Chunk[]; problems: Problem[]; tournaments: Tournament[] }) {
  const allowed = useMemo(() => problems.map(problem => problem.id), [problems]);
  const { selected: problemIds, ready: selectionReady } = useSelection(allowed);
  const [preferences, setPreferences] = useState<NotesPreferences>({ mode: 'recomendado', custom: null });
  const [ready, setReady] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [storageNotice, setStorageNotice] = useState('');
  const [downloadOrigin, setDownloadOrigin] = useState<'top' | 'bottom'>('top');
  const previousProblems = useRef<string | null>(null);
  const preview = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let restored: NotesPreferences = { mode: 'recomendado', custom: null };
    let ids: string[] = [];
    try {
      ids = readSelected(localStorage.getItem(SELECTION_KEY), allowed);
      restored = restoreNotesPreferences(localStorage.getItem(NOTES_CONFIG_KEY), localStorage.getItem(LEGACY_NOTES_CONFIG_KEY), chunks, ids);
    } catch {
      setStorageNotice('Podés armar y descargar el apunte, pero este navegador no permite guardar tus preferencias.');
    }
    const url = new URL(window.location.href);
    const incoming = url.searchParams.getAll('chunk');
    if (incoming.length) {
      const initial = restored.custom ?? activeNotesSelection(restored, recommendedChunkIds(problems.filter(problem => ids.includes(problem.id))), chunks);
      restored = { mode: 'personalizado', custom: addSuggestedSelection(initial, incoming, chunks) };
      // Consume the explicit action so a later reload respects removals.
      url.searchParams.delete('chunk');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }
    previousProblems.current = [...ids].sort().join('|');
    setPreferences(restored);
    setReady(true);

    function refreshPreferences(event: StorageEvent) {
      if (event.key === NOTES_CONFIG_KEY || event.key === null) {
        try {
          if (readSelected(localStorage.getItem(SELECTION_KEY), allowed).length) return;
          setPreferences(restoreNotesPreferences(localStorage.getItem(NOTES_CONFIG_KEY), localStorage.getItem(LEGACY_NOTES_CONFIG_KEY), chunks));
        } catch { /* The current draft remains usable. */ }
      }
    }
    window.addEventListener('storage', refreshPreferences);
    return () => window.removeEventListener('storage', refreshPreferences);
  }, [chunks, problems, allowed]);

  useEffect(() => {
    if (!ready || !selectionReady) return;
    const key = [...problemIds].sort().join('|');
    if (key === previousProblems.current) return;
    previousProblems.current = key;
    setPreferences({ mode: 'recomendado', custom: null });
    setMessage(''); setError('');
  }, [problemIds, ready, selectionReady]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(NOTES_CONFIG_KEY, serializeNotesPreferences(preferences)); }
    catch { setStorageNotice('Los cambios funcionan durante esta visita, pero no se pudieron guardar en el navegador.'); }
  }, [preferences, ready]);

  const selectedProblems = useMemo(() => problems.filter((problem) => problemIds.includes(problem.id)), [problems, problemIds]);
  const recommendedIds = recommendedChunkIds(selectedProblems);
  const selection = activeNotesSelection(preferences, recommendedIds, chunks);
  const custom = preferences.mode === 'personalizado';
  const missingRecommendations = chunks.filter((chunk) => chunk.id !== TEMPLATE_ID && recommendedIds.includes(chunk.id) && !hasAnySection(selection[chunk.id]));
  const content = selectedContentChunks(chunks, selection);
  const index = hasIndex(chunks, selection);
  const supports = suggestedPrerequisites(chunks, selection);
  const families = [...new Set(chunks.filter((chunk) => chunk.id !== TEMPLATE_ID).map((chunk) => chunk.family))];
  const template = chunks.find((chunk) => chunk.id === TEMPLATE_ID);
  const templateCode = template?.sections.ejemplos.match(/```cpp\s*\n([\s\S]*?)```/)?.[1]?.trim() ?? '';

  function change(next: Selection | ((previous: Selection) => Selection)) {
    setMessage('');
    setError('');
    setPreferences(previous => {
      const active = activeNotesSelection(previous, recommendedIds, chunks);
      return { mode: 'personalizado', custom: typeof next === 'function' ? next(active) : next };
    });
  }

  function chooseMode(mode: NotesMode) {
    setMessage(''); setError('');
    setPreferences(previous => switchNotesMode(previous, mode, selection));
  }

  function toggleChunk(id: string) {
    change((previous) => ({ ...previous, [id]: hasAnySection(previous[id]) ? { ...OFF } : defaultSections() }));
  }

  function togglePart(id: string, key: SectionKey) {
    change((previous) => ({ ...previous, [id]: { ...(previous[id] ?? OFF), [key]: !previous[id]?.[key] } }));
  }

  async function download(origin: 'top' | 'bottom') {
    if (working) return;
    setDownloadOrigin(origin);
    setWorking(true);
    setMessage('');
    setError('');
    try {
      const { downloadNotes } = await import('../lib/pdf-notes');
      await downloadNotes(chunks, selection);
      setMessage('El PDF está preparado. Podés abrirlo y leerlo sin conexión.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo generar el PDF. Probá nuevamente.');
    } finally {
      setWorking(false);
    }
  }

  return <div className="notes-builder">
    <StatementDownload problems={problems} tournaments={tournaments} includedChunkIds={content.map(chunk => chunk.id)}/>

    <section id="apuntes" className="builder-notes" aria-labelledby="notes-title">
    <div className="builder-selection-heading"><h2 id="notes-title">Apunte de herramientas</h2><span className="chip">C++17</span></div>
    <p className="muted">Las herramientas compartidas se incluyen una sola vez. La plantilla de C++ va siempre al inicio.</p>
    <fieldset className="notes-modes" disabled={!ready}>
      <legend>Elegí el contenido del apunte</legend>
      {MODES.map(mode => <label className={`notes-mode ${preferences.mode === mode.id ? 'is-active' : ''}`} key={mode.id}>
        <span><input type="radio" name="notes-mode" aria-label={mode.title} checked={preferences.mode === mode.id} onChange={() => chooseMode(mode.id)}/><strong>{mode.title}</strong></span>
        <small>{mode.description}</small>
      </label>)}
    </fieldset>
    <p className="muted notes-mode-context">{custom
      ? selectedProblems.length ? 'Personalizá este apunte. Al volver a entrar o cambiar los problemas, se carga Recomendado.' : 'Tu apunte libre se conserva en este navegador.'
      : 'Se actualiza al cambiar los problemas. Completo amplía estas herramientas, no toda la biblioteca.'}</p>
    {storageNotice && <p className="muted" role="status">{storageNotice}</p>}
    {!ready && <p role="status">Recuperando tu selección…</p>}
    <section className="panel builder-summary-card" aria-label="Resumen del apunte">
      <div className="builder-summary-heading">
        <div><p className="eyebrow">{MODES.find(mode => mode.id === preferences.mode)?.title}</p><h3>Tu apunte lleva <span data-testid="notes-content-count">{content.length}</span> {content.length === 1 ? 'bloque' : 'bloques'} + plantilla</h3></div>
        <div className="builder-summary-actions">
          <button type="button" className="button" disabled={!ready || working || content.length === 0} onClick={() => download('top')}>{working ? 'Preparando PDF…' : 'Descargar apunte PDF'}</button>
          {content.length > 0 && <a href="#vista-previa" onClick={() => { if (preview.current) preview.current.open = true; }}>Revisar vista previa ↓</a>}
        </div>
      </div>
      <div className="builder-included" role="region" aria-label="Herramientas incluidas">
        {content.length ? <ul>{content.map(chunk => <li key={chunk.id}><a href={`/apuntes/${chunk.id}/`} target="_blank" rel="noreferrer">{chunk.title} ↗</a></li>)}</ul>
          : <p className="muted">{selectedProblems.length ? 'Estos problemas no tienen herramientas recomendadas disponibles. Podés armar un apunte personalizado con la biblioteca.' : 'Elegí problemas del catálogo o usá Personalizado para armar un apunte libre.'}</p>}
      </div>
      <p className="muted builder-format"><span data-testid="notes-index-status">{index ? 'Con índice de contenidos.' : 'Sin índice: se agrega a partir de dos bloques.'}</span> A4 · listo para doble faz.</p>
      {selectedProblems.some(problem => problem.coverage !== 'completa') && <p className="builder-coverage">Hay problemas con cobertura parcial o fuera de alcance. Revisá las indicaciones junto a sus nombres.</p>}
      {!custom && <button className="builder-text-button" type="button" onClick={() => chooseMode('personalizado')}>Personalizar bloques y partes →</button>}
      {downloadOrigin === 'top' && message && <p role="status">{message}</p>}
      {downloadOrigin === 'top' && error && <p role="alert" className="builder-error">{error}</p>}
    </section>
    {custom && missingRecommendations.length > 0 && <div className="panel builder-missing">
      <p>Tu apunte omite {missingRecommendations.length} {missingRecommendations.length === 1 ? 'herramienta sugerida' : 'herramientas sugeridas'} para estos problemas.</p>
      <button type="button" className="button secondary small" onClick={() => change(previous => addSuggestedSelection(previous, recommendedIds, chunks))}>Añadir {missingRecommendations.length} bloques sugeridos por los problemas</button>
    </div>}

    <div className="builder-layout">
      {custom ? <div className="builder-controls">
        <section className="panel builder-template">
          <p className="eyebrow">Siempre al inicio</p>
          <h2>Plantilla de C++17</h2>
          <p className="muted">El programa inicial se incluye completo. Podés sumar sus explicaciones.</p>
          <div className="builder-parts">{(['descripcion', 'operaciones'] as const).map((key) => <label key={key}><input type="checkbox" disabled={!ready} checked={selection[TEMPLATE_ID]?.[key] ?? false} onChange={() => togglePart(TEMPLATE_ID, key)} />{SECTION_LABELS[key]}</label>)}</div>
        </section>

        <div className="builder-selection-heading"><h2>Bloques del apunte</h2><div className="builder-bulk">
          <button type="button" disabled={!ready} onClick={() => change((previous) => addSuggestedSelection(previous, chunks.map((chunk) => chunk.id), chunks))}>Añadir todos</button>
          <button type="button" disabled={!ready} onClick={() => change((previous) => Object.fromEntries(Object.entries(previous).map(([id, parts]) => [id, id === TEMPLATE_ID ? parts : { ...OFF }])))}>Quitar todos</button>
        </div></div>

        {families.map((family) => <details className="panel builder-family" key={family} open>
          <summary>{family}<span className="muted">{chunks.filter((chunk) => chunk.family === family && hasAnySection(selection[chunk.id])).length} seleccionados</span></summary>
          {chunks.filter((chunk) => chunk.family === family && chunk.id !== TEMPLATE_ID).map((chunk) => <div className="builder-chunk" key={chunk.id}>
            <div className="builder-chunk-title"><label><input type="checkbox" checked={hasAnySection(selection[chunk.id])} disabled={!ready} onChange={() => toggleChunk(chunk.id)} /><strong>{chunk.title}</strong></label><a href={`/apuntes/${chunk.id}/`} target="_blank" rel="noreferrer" aria-label={`Leer ${chunk.title} en otra pestaña`}>Consultar ↗</a></div>
            {hasAnySection(selection[chunk.id]) && <div className="builder-parts">{SECTION_KEYS.map((key) => <label key={key}><input type="checkbox" checked={selection[chunk.id]?.[key] ?? false} onChange={() => togglePart(chunk.id, key)} />{SECTION_LABELS[key]}</label>)}</div>}
          </div>)}
        </details>)}
      </div> : null}
    </div>
    {custom && supports.length > 0 && <section className="panel builder-supports"><h3>Apoyos que podés sumar</h3><p className="muted">Si ya los conocés o tenés impresos, dejalos fuera.</p><div>{supports.map((chunk) => <button key={chunk.id} type="button" className="chip" onClick={() => change((previous) => addSuggestedSelection(previous, [chunk.id], chunks))}>+ {chunk.title}</button>)}</div></section>}
    <section className="panel builder-download-bottom" aria-label="Descarga al final del apunte">
      <p><strong>{content.length} {content.length === 1 ? 'bloque' : 'bloques'} + plantilla de C++17</strong><br/><span className="muted">Descargá el apunte con el contenido que elegiste.</span></p>
      <button type="button" className="button" disabled={!ready || working || content.length === 0} onClick={() => download('bottom')}>{working ? 'Preparando PDF…' : 'Descargar apunte PDF'}</button>
      {downloadOrigin === 'bottom' && message && <p role="status">{message}</p>}
      {downloadOrigin === 'bottom' && error && <p role="alert" className="builder-error">{error}</p>}
    </section>

    <details id="vista-previa" className="builder-preview-section" open={custom} ref={preview}>
      <summary>Vista previa del apunte</summary>
      <div className="builder-selection-heading"><h2>Vista previa</h2><span className="muted">Mismas partes que el PDF</span></div>
      {content.length > 0 && <p className="muted builder-table-help">En pantallas chicas, desplazá las tablas hacia los costados para consultar todas sus columnas.</p>}
      {content.length > 0 ? <div className="panel builder-preview">
        {template && <article><h2>{template.title}</h2>{(['descripcion', 'operaciones'] as const).filter((key) => selection[TEMPLATE_ID]?.[key]).map((key) => <section key={key}><h3>{SECTION_LABELS[key]}</h3><div className="prose" dangerouslySetInnerHTML={{ __html: template.html[key] }} /></section>)}<pre><code>{templateCode}</code></pre></article>}
        {index && <nav aria-label="Índice de la vista previa"><h2>Índice</h2><ol>{content.map((chunk) => <li key={chunk.id}><a href={`#preview-${chunk.id}`}>{chunk.title}</a></li>)}</ol></nav>}
        {content.map((chunk) => <article id={`preview-${chunk.id}`} key={chunk.id}><h2>{chunk.title}</h2>{SECTION_KEYS.filter((key) => selection[chunk.id]?.[key]).map((key) => <section key={key}><h3>{SECTION_LABELS[key]}</h3><div className="prose" dangerouslySetInnerHTML={{ __html: chunk.html[key] }} /></section>)}</article>)}
      </div> : <div className="panel muted">La vista previa aparece cuando elegís un bloque.</div>}
    </details>
    </section>

    <style>{`
      .builder-notes { margin-top:2.5rem; scroll-margin-top:1.5rem; }
      .notes-modes { border:0; padding:0; margin:1.25rem 0 .65rem; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.7rem; }
      .notes-modes legend { font-weight:750; margin-bottom:.8rem; }
      .notes-mode { padding:1rem; border:1.5px solid var(--line); border-radius:10px; background:white; cursor:pointer; }
      .notes-mode.is-active { border:2px solid var(--blue); background:#edf0ff; padding:calc(1rem - .5px); }
      .notes-mode>span { display:flex; align-items:center; gap:.6rem; } .notes-mode input { flex-shrink:0; margin:0; }
      .notes-mode small { display:block; margin-top:.4rem; font-size:.8rem; color:var(--muted); line-height:1.5; }
      .notes-mode-context { font-size:.85rem; margin-bottom:1.4rem; }
      .builder-included h3 { margin-top:0; } .builder-included ul { list-style:none; padding:0; margin:0 0 1.5rem; }
      .builder-included li { display:flex; justify-content:space-between; flex-wrap:wrap; gap:.25rem 1rem; padding:.7rem 0; border-bottom:1px solid var(--line); }
      .builder-included li span { font-size:.8rem; } .builder-included a { font-weight:700; }
      .builder-text-button { color:var(--blue); border:0; padding:0; background:none; font:inherit; text-decoration:underline; cursor:pointer; }
      .builder-missing { margin-bottom:1rem; } .builder-missing p { margin-top:0; }
      .builder-layout { display:block; }
      .builder-controls { min-width:0; } .builder-template { margin-bottom:1.5rem; }
      .builder-template h2 { margin:.25rem 0; } .builder-template .muted { font-size:.95rem; }
      .builder-selection-heading { display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; margin-block:1.25rem .75rem; }
      .builder-selection-heading h2 { margin:0; }
      .builder-bulk { display:flex; gap:1rem; } .builder-bulk button { background:none; border:0; text-decoration:underline; color:inherit; font:inherit; font-size:.85rem; cursor:pointer; }
      .builder-family { margin-bottom:.8rem; padding-block:.95rem; }
      .builder-family>summary { cursor:pointer; font-weight:750; } .builder-family>summary .muted { font-weight:400; font-size:.8rem; margin-left:.75rem; }
      .builder-chunk { border-top:1px solid var(--border, #d4ded9); margin-top:.85rem; padding-top:.85rem; }
      .builder-chunk-title { display:flex; justify-content:space-between; align-items:baseline; gap:1rem; }
      .builder-chunk-title>a { font-size:.8rem; white-space:nowrap; }
      .builder-chunk-title label,.builder-parts label { display:flex; align-items:center; gap:.6rem; cursor:pointer; }
      .builder-chunk-title input,.builder-parts input { width:1rem; height:1rem; flex-shrink:0; accent-color:var(--accent, #135745); }
      .builder-parts { display:flex; flex-wrap:wrap; gap:.65rem 1rem; padding-top:.7rem; font-size:.85rem; }
      .builder-chunk .builder-parts { padding-left:1.6rem; }
      .builder-summary-card { display:grid; gap:.8rem; }
      .builder-summary-heading { display:flex; justify-content:space-between; align-items:start; gap:1rem; flex-wrap:wrap; }
      .builder-summary-heading .eyebrow { margin:0 0 .4rem; }
      .builder-summary-heading h3 { margin:0; font-size:1.5rem; }
      .builder-summary-actions { display:flex; flex-direction:column; gap:.7rem; align-items:center; }
      .builder-summary-actions>a { font-size:.85rem; }
      .builder-summary-card .builder-included ul { display:flex; flex-wrap:wrap; gap:.5rem; margin:.4rem 0; }
      .builder-summary-card .builder-included li { display:block; border:1px solid var(--line); border-radius:6px; padding:.3rem .65rem; background:var(--paper); font-size:.85rem; }
      .builder-summary-card .builder-text-button { justify-self:start; }
      .builder-format { font-size:.82rem; margin:0; }
      .builder-download-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; }
      .builder-download-bottom p { margin:0; }
      .builder-download-bottom .muted { font-size:.85rem; }
      .builder-download-bottom [role] { flex-basis:100%; }
      .builder-supports h3 { margin:0; } .builder-supports>div { display:flex; flex-wrap:wrap; gap:.4rem; }
      .builder-problems { margin-bottom:1.25rem; } .builder-problems h2 { margin-top:0; } .builder-problems li { margin-block:.65rem; }
      .builder-problems-link { display:inline-block; margin:.7rem 1rem 0 0; font-size:.9rem; }
      .builder-coverage { color:var(--warning-text, #815716); font-size:.88rem; margin:.3rem 0; }
      .builder-error { color:#a52727; overflow-wrap:anywhere; }
      .builder-preview-section { margin-top:2rem; scroll-margin-top:1rem; } .builder-preview-section>summary { cursor:pointer; font-size:1.1rem; font-weight:800; } .builder-preview { padding:clamp(1rem, 3.5vw, 3rem); }
      .builder-preview article+article,.builder-preview nav+article { border-top:1px solid var(--border, #d4ded9); padding-top:2rem; margin-top:2rem; }
      .builder-preview article { scroll-margin-top:1rem; overflow-wrap:anywhere; }
      .builder-preview pre { max-width:100%; overflow:auto; padding:1rem; background:#eef2ef; color:#142b22; border-radius:.5rem; font-size:.85rem; line-height:1.65; }
      .builder-preview table { display:block; overflow:auto; max-width:100%; }
      .builder-preview .prose table th,.builder-preview .prose table td { min-width:180px; overflow-wrap:normal; word-break:normal; }
      .builder-preview .prose table th:first-child,.builder-preview .prose table td:first-child { min-width:220px; }
      .builder-preview .prose table code { white-space:nowrap; }
      .builder-table-help { font-size:.85rem; }
      @media(max-width:850px) { .notes-modes { grid-template-columns:repeat(2,minmax(0,1fr)); } .builder-layout { grid-template-columns:minmax(0, 1fr); } }
      @media(max-width:480px) { .builder-summary-actions,.builder-download-bottom .button { width:100%; } .builder-summary-actions .button { width:100%; } .builder-chunk-title { align-items:start; } .builder-family>summary .muted { display:block; margin-left:1rem; margin-top:.25rem; } .builder-parts { flex-direction:column; } }
    `}</style>
  </div>;
}
