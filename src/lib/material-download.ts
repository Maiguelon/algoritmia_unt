import type { Chunk } from './chunks';
import type { Problem, Tournament } from './types';
import { notesLevel, presetSelection, recommendedChunkIds } from './notes-presets';
import { hasAnySection, selectedContentChunks, TEMPLATE_ID } from './composition';

let catalog: Promise<{ problems: Problem[]; tournaments: Tournament[] }> | undefined;
let notes: Promise<{ chunks: Chunk[] }> | undefined;

async function readData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo cargar el material. Revisá la conexión y probá de nuevo.');
  return response.json();
}

// Download data is loaded on demand, rather than embedding the whole library in every page.
function loadCatalog() {
  return catalog ??= readData<{ problems: Problem[]; tournaments: Tournament[] }>('/material/catalogo.json')
    .catch(error => { catalog = undefined; throw error; });
}
function loadNotes() {
  return notes ??= readData<{ chunks: Chunk[] }>('/material/apuntes.json')
    .catch(error => { notes = undefined; throw error; });
}

export async function downloadMaterial(kind: 'enunciados' | 'apunte', ids: string[]): Promise<void> {
  const { problems, tournaments } = await loadCatalog();
  const chosen = [...new Set(ids)].map(id => problems.find(problem => problem.id === id)).filter((problem): problem is Problem => Boolean(problem));
  if (!chosen.length) throw new Error('Seleccioná al menos un problema para descargar su material.');
  if (kind === 'enunciados') {
    if (chosen.some(problem => !problem.statementUrl)) throw new Error('Hay enunciados pendientes. Revisá tu selección para descargar los disponibles.');
    const { downloadStatements } = await import('./pdf-statements');
    await downloadStatements(chosen, tournaments);
    return;
  }
  const { chunks } = await loadNotes();
  const selection = presetSelection('recomendado', recommendedChunkIds(chosen), chunks, notesLevel(chosen));
  if (!selectedContentChunks(chunks, selection).length && !hasAnySection(selection[TEMPLATE_ID])) throw new Error('Estos problemas todavía no tienen herramientas recomendadas. Revisá su cobertura en la selección.');
  const { downloadNotes } = await import('./pdf-notes');
  await downloadNotes(chunks, selection);
}
