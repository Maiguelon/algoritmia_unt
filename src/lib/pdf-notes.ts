import type { Chunk } from './chunks';
import { hasAnySection, hasIndex, includesTemplate, selectedContentChunks, SECTION_KEYS, SECTION_LABELS, TEMPLATE_ID, type Selection } from './composition';
import { baseDefinition, codeToPdf, markdownToPdf, renderPdf, savePdf, type PdfDefinition, type PdfNode } from './pdf-engine';

export function buildNotesDefinition(chunks: Chunk[], selection: Selection): PdfDefinition {
  const template = chunks.find((chunk) => chunk.id === TEMPLATE_ID);
  const withTemplate = includesTemplate(selection);
  if (withTemplate && !template) throw new Error('Falta el bloque de plantilla de C++.');
  const selected = selectedContentChunks(chunks, selection);
  if (!selected.length && !hasAnySection(selection[TEMPLATE_ID])) {
    throw new Error('Seleccioná al menos un bloque o la plantilla para generar el apunte.');
  }
  const definition = baseDefinition('Apunte de C++17 - Algoritmia UNT');
  const content: PdfNode[] = [
    { text: 'Apunte de C++17', style: 'documentTitle' },
    { text: 'Herramientas seleccionadas - GNU C++17', style: 'subtle' },
  ];
  if (withTemplate && template) {
    const code = template.sections.ejemplos.match(/```cpp\s*\n([\s\S]*?)```/)?.[1];
    if (!code) throw new Error('La plantilla no tiene su programa inicial.');
    content.push({ text:template.title, style:'chunkTitle', headlineLevel:1 });
    if (selection[TEMPLATE_ID]?.descripcion) content.push(...markdownToPdf(template.sections.descripcion));
    content.push(codeToPdf(code));
    if (selection[TEMPLATE_ID]?.operaciones) content.push(...markdownToPdf(template.sections.operaciones));
  }
  if (hasIndex(chunks, selection)) {
    content.push({
      unbreakable: selected.length <= 40,
      ...(selected.length > 40 ? { pageBreak: 'before' } : {}),
      toc: {
        title: { text: 'Índice', style: 'chunkTitle' },
        textStyle: { fontSize: 9.5 }, numberStyle: { fontSize: 9.5 },
      },
      margin: [0, 8, 0, 10],
    });
  }
  for (const [index, chunk] of selected.entries()) {
    content.push({ text: chunk.title, style: 'chunkTitle', headlineLevel: 1, tocItem: true, id: chunk.id,
      ...(withTemplate || hasIndex(chunks, selection) || index > 0 ? { pageBreak:'before' } : {}),
    });
    for (const key of SECTION_KEYS) {
      if (!selection[chunk.id]?.[key]) continue;
      content.push({ text: SECTION_LABELS[key], style: 'sectionTitle', headlineLevel: 2 });
      content.push(...markdownToPdf(chunk.sections[key]));
    }
    // Discard trailing spacing at the block boundary: pdfmake can spill that
    // margin onto an empty page just before the next explicit page break.
    const last = content.at(-1)!;
    if (Array.isArray(last.margin) && last.margin.length === 4) {
      last.margin = [...last.margin.slice(0, 3), 0];
    }
  }
  definition.content = content;
  return definition;
}

export async function createNotesPdf(chunks: Chunk[], selection: Selection): Promise<Uint8Array> {
  return renderPdf(buildNotesDefinition(chunks, selection));
}

export async function downloadNotes(chunks: Chunk[], selection: Selection): Promise<void> {
  savePdf(await createNotesPdf(chunks, selection), 'apunte-cpp-algoritmia-unt.pdf');
}
