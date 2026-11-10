import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Problem, Tournament } from './types';
import { renderPdf, savePdf } from './pdf-engine';
import { buildStatementIndex, type StatementIndexEntry } from './statement-index';

export type StatementBytesLoader = (url: string) => Promise<Uint8Array | ArrayBuffer>;

async function fetchStatement(url: string): Promise<Uint8Array> {
  if (!url.startsWith('/') || url.startsWith('//')) throw new Error('El enunciado debe estar preparado entre los archivos del sitio.');
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo descargar un enunciado. Volvé a intentarlo.');
  return new Uint8Array(await response.arrayBuffer());
}

export function uniqueStatementProblems(problems: Problem[]): Problem[] {
  return [...new Map(problems.map(problem => [problem.id, problem])).values()];
}

/** Primero el índice con enlaces/QR; luego las páginas originales, sin portadas intermedias. */
export async function createStatementsPdf(
  problems: Problem[], tournaments: Tournament[], loadBytes: StatementBytesLoader = fetchStatement,
): Promise<Uint8Array> {
  const selected = uniqueStatementProblems(problems);
  if (!selected.length) throw new Error('Seleccioná al menos un problema para generar los enunciados.');
  const sources: Array<{ problem: Problem; tournament: Tournament; original: PDFDocument }> = [];
  for (const problem of selected) {
    if (!problem.statementUrl) throw new Error(`El enunciado de ${problem.letter}. ${problem.title} todavía no está disponible para descargar.`);
    const tournament = tournaments.find(item => item.id === problem.tournamentId);
    if (!tournament) throw new Error(`No se encontró el torneo de ${problem.title}.`);
    const original = await PDFDocument.load(await loadBytes(problem.statementUrl));
    if (!original.getPageCount()) throw new Error(`El enunciado de ${problem.title} está vacío.`);
    sources.push({ problem, tournament, original });
  }

  // La cantidad real de páginas del índice determina el inicio de los problemas.
  // Recalcular permite también selecciones grandes, cuyo índice ocupa varias hojas.
  let indexPages = 1;
  let indexPdf: PDFDocument | undefined;
  for (let attempt = 0; attempt < 8; ++attempt) {
    let page = indexPages + 1;
    const entries: StatementIndexEntry[] = sources.map(source => {
      const entry = { problem: source.problem, tournament: source.tournament, page };
      page += source.original.getPageCount();
      return entry;
    });
    indexPdf = await PDFDocument.load(await renderPdf(buildStatementIndex(entries)));
    if (indexPdf.getPageCount() === indexPages) break;
    indexPages = indexPdf.getPageCount();
    indexPdf = undefined;
  }
  if (!indexPdf) throw new Error('No se pudo calcular el índice del paquete.');

  const output = await PDFDocument.create();
  output.setTitle('Enunciados de práctica - Algoritmia UNT');
  output.setAuthor('Club de Algoritmia - UNT');
  for (const page of await output.copyPages(indexPdf, indexPdf.getPageIndices())) output.addPage(page);
  for (const { original } of sources) {
    for (const page of await output.copyPages(original, original.getPageIndices())) output.addPage(page);
  }
  const font = await output.embedFont(StandardFonts.Helvetica);
  output.getPages().forEach((page, index) => {
    const label = String(index + 1);
    page.drawText(label, { x: page.getWidth() - 30 - font.widthOfTextAtSize(label, 8), y: 12, size: 8, font, color: rgb(0.35, 0.35, 0.35) });
  });
  return output.save();
}

export async function downloadStatements(problems: Problem[], tournaments: Tournament[]): Promise<void> {
  savePdf(await createStatementsPdf(problems, tournaments), 'enunciados-algoritmia-unt.pdf');
}
