import { useEffect, useMemo, useState } from 'react';
import type { Chunk } from '../lib/chunks';
import type { Problem } from '../lib/types';
import {
  TEMPLATE_ID, SECTION_KEYS, SECTION_LABELS, addSuggestedSelection, defaultSections,
  hasAnySection, hasIndex, parseStoredSelection, selectedContentChunks,
  suggestedPrerequisites, suggestedSelection,
  type SectionKey, type Selection,
} from '../lib/composition';

const CONFIG_KEY = 'algoritmia:notes:v1';
const PROBLEMS_KEY = 'algoritmia:selected';
const OFF = { descripcion: false, operaciones: false, ejemplos: false };

function readProblemIds(raw: string | null, problems: Problem[]): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    const valid = new Set(problems.map((problem) => problem.id));
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && valid.has(id)))] : [];
  } catch {
    return [];
  }
}

export default function NotesBuilder({ chunks, problems }: { chunks: Chunk[]; problems: Problem[] }) {
  const [selection, setSelection] = useState<Selection>({});
  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [storageNotice, setStorageNotice] = useState('');

  useEffect(() => {
    let restored: Selection | null = null;
    let ids: string[] = [];
    try {
      restored = parseStoredSelection(localStorage.getItem(CONFIG_KEY), chunks);
      ids = readProblemIds(localStorage.getItem(PROBLEMS_KEY), problems);
    } catch {
      setStorageNotice('Podés armar y descargar el apunte, pero este navegador no permite guardar tus preferencias.');
    }
    const suggested = problems.filter((problem) => ids.includes(problem.id)).flatMap((problem) => problem.chunkIds);
    let initial = restored ?? suggestedSelection(suggested, chunks);
    const url = new URL(window.location.href);
    const incoming = url.searchParams.getAll('chunk');
    if (incoming.length) {
      initial = addSuggestedSelection(initial, incoming, chunks);
      // Consume the explicit action so a later reload respects removals.
      url.searchParams.delete('chunk');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }
    setProblemIds(ids);
    setSelection(initial);
    setReady(true);

    function refreshProblems(event: Event) {
      if (event.type === 'algoritmia:selection' || (event as StorageEvent).key === PROBLEMS_KEY || (event as StorageEvent).key === null) {
        try { setProblemIds(readProblemIds(localStorage.getItem(PROBLEMS_KEY), problems)); } catch { /* The current selection remains usable. */ }
      }
    }
    window.addEventListener('storage', refreshProblems);
    window.addEventListener('algoritmia:selection', refreshProblems);
    return () => { window.removeEventListener('storage', refreshProblems); window.removeEventListener('algoritmia:selection', refreshProblems); };
  }, [chunks, problems]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify({ version: 1, selection })); }
    catch { setStorageNotice('Los cambios funcionan durante esta visita, pero no se pudieron guardar en el navegador.'); }
  }, [selection, ready]);

  const selectedProblems = useMemo(() => problems.filter((problem) => problemIds.includes(problem.id)), [problems, problemIds]);
  const recommendedIds = [...new Set(selectedProblems.flatMap((problem) => problem.chunkIds))];
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
    setSelection(next);
  }

  function toggleChunk(id: string) {
    change((previous) => ({ ...previous, [id]: hasAnySection(previous[id]) ? { ...OFF } : defaultSections() }));
  }

  function togglePart(id: string, key: SectionKey) {
    change((previous) => ({ ...previous, [id]: { ...(previous[id] ?? OFF), [key]: !previous[id]?.[key] } }));
  }

  async function download() {
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
    <div className="panel builder-intro">
      <p>Elegí las herramientas y qué parte querés llevar de cada una. La plantilla va primero y una sola vez. Los apoyos se sugieren: vos decidís si sumarlos.</p>
      {storageNotice && <p className="muted" role="status">{storageNotice}</p>}
      {!ready && <p role="status">Recuperando tu selección…</p>}
    </div>

    {selectedProblems.length > 0 && <section className="panel builder-problems" aria-label="Problemas seleccionados">
      <h2>Para tus problemas</h2>
      <ul>{selectedProblems.map((problem) => <li key={problem.id}>
        <a href={`/problemas/${problem.id}/`}>{problem.letter}. {problem.title}</a>
        {problem.coverage !== 'completa' && <p className="builder-coverage">{problem.coverage === 'fuera de alcance' ? 'Fuera del alcance actual de los apuntes.' : <>Cobertura {problem.coverage}. {problem.missingTools.length ? `Todavía faltan: ${problem.missingTools.join(', ')}.` : 'Revisá los requisitos antes de confiar en este apunte.'}</>}</p>}
      </li>)}</ul>
      <p className="muted">Las herramientas corresponden al enfoque señalado en cada ficha. Podés modificar esta propuesta.</p>
      {missingRecommendations.length > 0 && <button type="button" className="button secondary" onClick={() => change((previous) => addSuggestedSelection(previous, recommendedIds, chunks))}>Añadir {missingRecommendations.length} bloques sugeridos por los problemas</button>}
      <a className="builder-problems-link" href="/problemas/">Elegir otros problemas →</a>
    </section>}

    <div className="builder-layout">
      <div className="builder-controls">
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
      </div>

      <aside className="builder-summary">
        <section className="panel builder-summary-card" aria-label="Resumen del apunte">
          <p className="eyebrow">Tu selección</p>
          <h2><span data-testid="notes-content-count">{content.length}</span> {content.length === 1 ? 'bloque' : 'bloques'} + plantilla</h2>
          <p data-testid="notes-index-status">{index ? 'Con índice de contenidos.' : 'Sin índice: se agrega a partir de dos bloques.'}</p>
          <p className="muted">A4 · código seleccionable · listo para doble faz</p>
          {content.length > 0 ? <ol>{content.map((chunk) => <li key={chunk.id}>{chunk.title}</li>)}</ol> : <p>Elegí al menos un bloque para preparar el apunte.</p>}
          <button type="button" className="button" disabled={!ready || working || content.length === 0} onClick={download}>{working ? 'Preparando PDF…' : 'Descargar apunte PDF'}</button>
          {message && <p role="status">{message}</p>}
          {error && <p role="alert" className="builder-error">{error}</p>}
          {content.length > 0 && <a href="#vista-previa">Revisar vista previa ↓</a>}
        </section>
        {supports.length > 0 && <section className="panel builder-supports"><h3>Apoyos que podés sumar</h3><p className="muted">Si ya los conocés o tenés impresos, dejalos fuera.</p><div>{supports.map((chunk) => <button key={chunk.id} type="button" className="chip" onClick={() => change((previous) => addSuggestedSelection(previous, [chunk.id], chunks))}>+ {chunk.title}</button>)}</div></section>}
      </aside>
    </div>

    <section id="vista-previa" className="builder-preview-section" aria-label="Vista previa del apunte">
      <div className="builder-selection-heading"><h2>Vista previa</h2><span className="muted">Mismas partes que el PDF</span></div>
      {content.length > 0 && <p className="muted builder-table-help">En pantallas chicas, desplazá las tablas hacia los costados para consultar todas sus columnas.</p>}
      {content.length > 0 ? <div className="panel builder-preview">
        {template && <article><h2>{template.title}</h2>{(['descripcion', 'operaciones'] as const).filter((key) => selection[TEMPLATE_ID]?.[key]).map((key) => <section key={key}><h3>{SECTION_LABELS[key]}</h3><div className="prose" dangerouslySetInnerHTML={{ __html: template.html[key] }} /></section>)}<pre><code>{templateCode}</code></pre></article>}
        {index && <nav aria-label="Índice de la vista previa"><h2>Índice</h2><ol>{content.map((chunk) => <li key={chunk.id}><a href={`#preview-${chunk.id}`}>{chunk.title}</a></li>)}</ol></nav>}
        {content.map((chunk) => <article id={`preview-${chunk.id}`} key={chunk.id}><h2>{chunk.title}</h2>{SECTION_KEYS.filter((key) => selection[chunk.id]?.[key]).map((key) => <section key={key}><h3>{SECTION_LABELS[key]}</h3><div className="prose" dangerouslySetInnerHTML={{ __html: chunk.html[key] }} /></section>)}</article>)}
      </div> : <div className="panel muted">La vista previa aparece cuando elegís un bloque.</div>}
    </section>

    <style>{`
      .builder-intro { margin-bottom:1.25rem; } .builder-intro>p:first-child { margin-top:0; }
      .builder-layout { display:grid; grid-template-columns:minmax(0, 1fr) 310px; gap:1.25rem; align-items:start; }
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
      .builder-summary { position:sticky; top:1rem; display:grid; gap:1rem; } .builder-summary h2 { margin:.25rem 0 .8rem; }
      .builder-summary-card { display:grid; gap:.7rem; } .builder-summary-card>p { margin:0; } .builder-summary-card ol { margin:.3rem 0; padding-left:1.25rem; font-size:.88rem; max-height:18rem; overflow:auto; }
      .builder-summary-card .button { width:100%; text-align:center; } .builder-summary-card>a { font-size:.85rem; }
      .builder-summary-card .muted { font-size:.85rem; }
      .builder-supports h3 { margin:0; } .builder-supports>div { display:flex; flex-wrap:wrap; gap:.4rem; }
      .builder-problems { margin-bottom:1.25rem; } .builder-problems h2 { margin-top:0; } .builder-problems li { margin-block:.65rem; }
      .builder-problems-link { display:inline-block; margin:.7rem 1rem 0 0; font-size:.9rem; }
      .builder-coverage { color:var(--warning-text, #815716); font-size:.88rem; margin:.3rem 0; }
      .builder-error { color:#a52727; overflow-wrap:anywhere; }
      .builder-preview-section { margin-top:2.5rem; scroll-margin-top:1rem; } .builder-preview { padding:clamp(1rem, 3.5vw, 3rem); }
      .builder-preview article+article,.builder-preview nav+article { border-top:1px solid var(--border, #d4ded9); padding-top:2rem; margin-top:2rem; }
      .builder-preview article { scroll-margin-top:1rem; overflow-wrap:anywhere; }
      .builder-preview pre { max-width:100%; overflow:auto; padding:1rem; background:#eef2ef; color:#142b22; border-radius:.5rem; font-size:.85rem; line-height:1.65; }
      .builder-preview table { display:block; overflow:auto; max-width:100%; }
      .builder-preview .prose table th,.builder-preview .prose table td { min-width:180px; overflow-wrap:normal; word-break:normal; }
      .builder-preview .prose table th:first-child,.builder-preview .prose table td:first-child { min-width:220px; }
      .builder-preview .prose table code { white-space:nowrap; }
      .builder-table-help { font-size:.85rem; }
      @media(max-width:850px) { .builder-layout { grid-template-columns:minmax(0, 1fr); } .builder-summary { position:static; grid-row:1; } .builder-summary-card ol { max-height:9rem; } }
      @media(max-width:480px) { .builder-chunk-title { align-items:start; } .builder-family>summary .muted { display:block; margin-left:1rem; margin-top:.25rem; } .builder-parts { flex-direction:column; } }
    `}</style>
  </div>;
}
