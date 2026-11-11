import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { chunks } from '../src/lib/chunks';
import { defaultSections, type Selection } from '../src/lib/composition';
import { buildNotesDefinition, createNotesPdf } from '../src/lib/pdf-notes';
import { markdownToPdf } from '../src/lib/pdf-engine';

const select = (...ids: string[]): Selection => Object.fromEntries(ids.map((id) => [id, defaultSections()]));

describe('composición del PDF del apunte', () => {
  it('rechaza una selección vacía y una plantilla ausente', () => {
    expect(() => buildNotesDefinition(chunks, {})).toThrow('Seleccioná');
    expect(() => buildNotesDefinition(chunks.filter((chunk) => chunk.id !== 'cpp-plantilla'), select('cpp-set'))).toThrow('plantilla');
  });

  it('conserva un único programa inicial y omite el índice para un contenido', () => {
    const definition = buildNotesDefinition(chunks, select('cpp-set'));
    const text = JSON.stringify(definition.content);
    expect(text.match(/#include <bits\/stdc\+\+\.h>/g)).toHaveLength(1);
    expect(definition.content.some((node) => 'toc' in node)).toBe(false);
    expect(text).toContain('int main()');
    expect(text).not.toContain('Guardar distintos'); // Heading from set examples, excluded.
  });

  it('cuenta contenidos distintos y permite controlar las otras partes de plantilla', () => {
    const selection = select('cpp-set', 'cpp-map');
    selection['cpp-plantilla'] = { descripcion: true, operaciones: false, ejemplos: false };
    const duplicate = chunks.find((chunk) => chunk.id === 'cpp-map')!;
    const definition = buildNotesDefinition([...chunks, duplicate], selection);
    expect(definition.content.filter((node) => 'toc' in node)).toHaveLength(1);
    expect(definition.content.filter((node) => node.id === 'cpp-map')).toHaveLength(1);
    expect(JSON.stringify(definition)).toContain('El programa empieza');
    expect(definition.content.find((node) => node.id === 'cpp-set')?.tocItem).toBe(true);
  });

  it('admite la plantilla sola sin índice, siempre con su código', () => {
    const definition = buildNotesDefinition(chunks, select('cpp-plantilla'));
    expect(definition.content.some((node) => 'toc' in node)).toBe(false);
    expect(JSON.stringify(definition)).toContain('int main()');
  });

  it('omite la plantilla cuando está excluida y separa los comienzos de los bloques', () => {
    const off={descripcion:false,operaciones:false,ejemplos:false};
    const definition=buildNotesDefinition(chunks,{...select('cpp-set','cpp-prefijos'),'cpp-plantilla':off});
    expect(JSON.stringify(definition)).not.toContain('int main()');
    expect(definition.content.filter(node=>node.id==='cpp-set'||node.id==='cpp-prefijos').every(node=>node.pageBreak==='before')).toBe(true);
    const single=buildNotesDefinition(chunks,{...select('cpp-set'),'cpp-plantilla':off});
    expect(single.content.find(node=>node.id==='cpp-set')?.pageBreak).toBeUndefined();
  });

  it('convierte tablas y código sin aplanar la estructura de Markdown', () => {
    const nodes = markdownToPdf('| Uso | Resultado |\n|---|---|\n| `v.size()` | Cantidad |\n\n```cpp\n  int n = 3;\n```');
    expect(nodes.filter((node) => 'table' in node)).toHaveLength(2);
    expect(JSON.stringify(nodes)).toContain('Mono');
    expect(JSON.stringify(nodes)).toContain('  int n = 3;');
  });

  it('no deja una hoja vacía entre una tabla que llena la página y el bloque siguiente', async () => {
    const off={descripcion:false,operaciones:false,ejemplos:false};
    const functions={descripcion:false,operaciones:true,ejemplos:false};
    const bytes=await createNotesPdf(chunks,{'cpp-plantilla':off,'cpp-vectores':functions,'cpp-pares':functions});
    const document=await PDFDocument.load(bytes);
    // Índice, vectores y pares: una página cada uno, sin hoja intermedia.
    expect(document.getPageCount()).toBe(3);
  },20_000);

  it('produce un PDF A4 válido con texto, tablas y código incorporados', async () => {
    const selection = select('cpp-set', 'cpp-vectores');
    selection['cpp-set'].ejemplos = true;
    const bytes = await createNotesPdf(chunks, selection);
    const document = await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBeGreaterThan(0);
    expect(document.getPageCount()).toBeLessThan(15);
    const { width, height } = document.getPage(0).getSize();
    expect(width).toBeCloseTo(595.28, 1);
    expect(height).toBeCloseTo(841.89, 1);
    expect(document.getTitle()).toContain('C++17');
  }, 20_000);
});
