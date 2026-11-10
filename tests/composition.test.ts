import { describe, expect, it } from 'vitest';
import type { Chunk } from '../src/lib/chunks';
import {
  addSuggestedSelection, defaultSections, hasIndex, parseStoredSelection,
  sanitizeSelection, selectedContentChunks, suggestedPrerequisites, suggestedSelection,
} from '../src/lib/composition';

function chunk(id: string, suggestedPrerequisites: string[] = []): Chunk {
  return {
    id, title: id, family: 'Contenedores',
    sections: { descripcion: '', operaciones: '', ejemplos: '' },
    html: { descripcion: '', operaciones: '', ejemplos: '' },
    suggestedPrerequisites,
  };
}
const chunks = [chunk('cpp-plantilla'), chunk('cpp-iteradores'), chunk('cpp-set', ['cpp-iteradores']), chunk('cpp-map', ['cpp-iteradores'])];

describe('composición de apuntes', () => {
  it('no cuenta la plantilla ni la cantidad de partes al decidir el índice', () => {
    expect(hasIndex(chunks, {})).toBe(false);
    const selection = { 'cpp-plantilla': { descripcion: true, operaciones: true, ejemplos: true }, 'cpp-set': { descripcion: true, operaciones: true, ejemplos: true } };
    expect(selectedContentChunks(chunks, selection).map((item) => item.id)).toEqual(['cpp-set']);
    expect(hasIndex(chunks, selection)).toBe(false);
    expect(hasIndex(chunks, { ...selection, 'cpp-map': defaultSections() })).toBe(true);
  });

  it('une problemas que necesitan el mismo bloque sin repetirlo', () => {
    const selection = suggestedSelection(['cpp-set', 'cpp-set', 'cpp-plantilla'], chunks);
    expect(Object.keys(selection)).toEqual(['cpp-set']);
    expect(selectedContentChunks([...chunks, chunk('cpp-set')], selection)).toHaveLength(1);
    expect(hasIndex(chunks, selection)).toBe(false);
  });

  it('sugiere apoyos sin agregarlos automáticamente', () => {
    const selection = suggestedSelection(['cpp-set'], chunks);
    expect(suggestedPrerequisites(chunks, selection).map((item) => item.id)).toEqual(['cpp-iteradores']);
    expect(selectedContentChunks(chunks, selection).map((item) => item.id)).toEqual(['cpp-set']);
  });

  it('no incluye un bloque cuando todas sus partes están desmarcadas', () => {
    const selection = { 'cpp-set': { descripcion: false, operaciones: false, ejemplos: false } };
    expect(selectedContentChunks(chunks, selection)).toEqual([]);
    expect(sanitizeSelection(selection, chunks)).toEqual(selection);
  });

  it('restaura decisiones vacías o desmarcadas sin reemplazarlas por sugerencias', () => {
    const empty = JSON.stringify({ version: 1, selection: {} });
    expect(parseStoredSelection(empty, chunks)).toEqual({});
    const off = { 'cpp-set': { descripcion: false, operaciones: false, ejemplos: false } };
    expect(parseStoredSelection(JSON.stringify({ version: 1, selection: off }), chunks)).toEqual(off);
    expect(parseStoredSelection('{no es json', chunks)).toBeNull();
    expect(parseStoredSelection(JSON.stringify({ version: 2, selection: off }), chunks)).toBeNull();
  });

  it('descarta IDs antiguos y valores corruptos sin activar contenido', () => {
    const selection = sanitizeSelection({
      'cpp-no-existe': defaultSections(),
      'cpp-set': { descripcion: 'true', operaciones: true, ejemplos: 1 },
      'cpp-map': null,
    }, chunks);
    expect(selection).toEqual({ 'cpp-set': { descripcion: false, operaciones: true, ejemplos: false } });
  });

  it('añadir sugerencias conserva las partes elegidas y requiere una acción explícita para reactivar un bloque', () => {
    const previous = { 'cpp-set': { descripcion: true, operaciones: false, ejemplos: true }, 'cpp-map': { descripcion: false, operaciones: false, ejemplos: false } };
    const next = addSuggestedSelection(previous, ['cpp-set', 'cpp-map', 'cpp-antiguo'], chunks);
    expect(next['cpp-set']).toEqual(previous['cpp-set']);
    expect(next['cpp-map']).toEqual(defaultSections());
    expect(previous['cpp-map'].operaciones).toBe(false);
    expect(next).not.toHaveProperty('cpp-antiguo');
  });
});
