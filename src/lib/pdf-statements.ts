import { PDFDocument } from 'pdf-lib';
import type { Problem, Tournament } from './types';
import { baseDefinition, renderPdf, savePdf, type PdfDefinition, type PdfNode } from './pdf-engine';

export type StatementBytesLoader = (url: string) => Promise<Uint8Array | ArrayBuffer>;

async function fetchStatement(url: string): Promise<Uint8Array> {
  if (!url.startsWith('/') || url.startsWith('//')) throw new Error('El enunciado debe estar preparado entre los archivos del sitio.');
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo descargar un enunciado. Volvé a intentarlo.');
  return new Uint8Array(await response.arrayBuffer());
}

export function uniqueStatementProblems(problems: Problem[]): Problem[] {
  return [...new Map(problems.map((problem) => [problem.id, problem])).values()];
}

export function buildStatementCover(problem: Problem, tournament: Tournament): PdfDefinition {
  const definition = baseDefinition(`${problem.letter}. ${problem.title} - Enunciado`);
  // A cover is merged with originals; its standalone "1 / 1" would be misleading.
  definition.footer = undefined;
  const targetUrl = problem.judgeUrl ?? problem.sourceUrl;
  definition.content = [
    { text: 'Enunciado de práctica', style: 'subtle', margin: [0, 0, 0, 14] },
    { text: `${problem.letter}. ${problem.title}`, style: 'documentTitle' },
    { text: tournament.title, fontSize: 13, margin: [0, 8, 0, 24] },
    {
      columns: [
        { width: '*', stack: [
          { text: problem.judgeUrl ? 'Abrir en el juez' : 'Consultar la fuente original', style: 'sectionTitle' },
          { text: targetUrl, link: targetUrl, decoration: 'underline', fontSize: 9 },
          { text: problem.judgeUrl ? 'El QR abre el mismo enlace.' : 'Todavía no hay un enlace de juez verificado para este problema.', style: 'subtle', margin: [0, 9, 0, 0] },
        ] },
        { width: 110, qr: targetUrl, fit: 100, margin: [12, 6, 0, 0] },
      ],
    },
    { text: 'Enunciado original', style: 'sectionTitle', margin: [0, 32, 0, 8] },
    { text: 'Las páginas siguientes conservan el enunciado publicado. Esta hoja identifica el problema y sus enlaces; no contiene pistas ni soluciones.' },
    { text: 'Fuente', style: 'sectionTitle' },
    { text: problem.sourceUrl, link: problem.sourceUrl, decoration: 'underline', fontSize: 8.5 },
  ];
  return definition;
}

/** Originals are copied as PDF pages, retaining diagrams, selectable text and samples. */
export async function createStatementsPdf(
  problems: Problem[],
  tournaments: Tournament[],
  loadBytes: StatementBytesLoader = fetchStatement,
): Promise<Uint8Array> {
  const selected = uniqueStatementProblems(problems);
  if (!selected.length) throw new Error('Seleccioná al menos un problema para generar los enunciados.');
  const sources: Array<{ problem: Problem; tournament: Tournament; original: PDFDocument; cover: PDFDocument }> = [];
  for (const problem of selected) {
    if (!problem.statementUrl) throw new Error(`El enunciado de ${problem.letter}. ${problem.title} todavía no está disponible para descargar.`);
    const tournament = tournaments.find((item) => item.id === problem.tournamentId);
    if (!tournament) throw new Error(`No se encontró el torneo de ${problem.title}.`);
    const original = await PDFDocument.load(await loadBytes(problem.statementUrl));
    if (!original.getPageCount()) throw new Error(`El enunciado de ${problem.title} está vacío.`);
    const cover = await PDFDocument.load(await renderPdf(buildStatementCover(problem, tournament)));
    sources.push({ problem, tournament, original, cover });
  }
  const output = await PDFDocument.create();
  output.setTitle('Enunciados de práctica - Algoritmia UNT');
  output.setAuthor('Club de Algoritmia - UNT');
  output.setSubject('Enunciados originales con fuentes y enlaces para practicar');
  if (sources.length > 1) {
    const index = baseDefinition('Índice de enunciados');
    index.footer = undefined;
    const rows: PdfNode[][] = [];
    // One index page is expected for the current catalogue. Build once to learn
    // its real size so larger future selections retain correct page numbers.
    const makeIndex = (indexPages: number): PdfDefinition => {
      let page = indexPages + 1;
      rows.length = 0;
      for (const source of sources) {
        rows.push([
          { text: `${source.problem.letter}. ${source.problem.title}`, bold: true },
          { text: source.tournament.title, fontSize: 8 },
          { text: String(page), alignment: 'right' },
        ]);
        page += source.cover.getPageCount() + source.original.getPageCount();
      }
      index.content = [
        { text: 'Enunciados de práctica', style: 'documentTitle' },
        { text: 'Índice', style: 'chunkTitle' },
        { table: { headerRows: 1, widths: ['*', 150, 35], body: [
          [{ text: 'Problema', bold: true }, { text: 'Torneo', bold: true }, { text: 'Página', bold: true }],
          ...rows,
        ] }, layout: 'lightHorizontalLines' },
      ];
      return index;
    };
    let indexPdf = await PDFDocument.load(await renderPdf(makeIndex(1)));
    if (indexPdf.getPageCount() !== 1) indexPdf = await PDFDocument.load(await renderPdf(makeIndex(indexPdf.getPageCount())));
    for (const page of await output.copyPages(indexPdf, indexPdf.getPageIndices())) output.addPage(page);
  }
  for (const { cover, original } of sources) {
    for (const page of await output.copyPages(cover, cover.getPageIndices())) output.addPage(page);
    for (const page of await output.copyPages(original, original.getPageIndices())) output.addPage(page);
  }
  return output.save();
}

export async function downloadStatements(problems: Problem[], tournaments: Tournament[]): Promise<void> {
  savePdf(await createStatementsPdf(problems, tournaments), 'enunciados-algoritmia-unt.pdf');
}
