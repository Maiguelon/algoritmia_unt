import { describe, expect, it } from 'vitest';
import {
  activeNotesSelection, presetSelection, recommendedChunkIds, restoreNotesPreferences,
  serializeNotesPreferences, switchNotesMode, type NotesPreferences,
} from '../src/lib/notes-presets';

const chunks = ['cpp-plantilla', 'cpp-set', 'cpp-find', 'cpp-map'].map(id => ({ id }));
const off = { descripcion: false, operaciones: false, ejemplos: false };
const problems = [
  { chunkIds: ['cpp-set', 'cpp-find'], coverage: 'completa' as const, difficulty:'Consolidación' as const },
  { chunkIds: ['cpp-set'], coverage: 'parcial' as const, difficulty:'Consolidación' as const },
  { chunkIds: ['cpp-map'], coverage: 'fuera de alcance' as const, difficulty:'Top global' as const },
];

describe('modos del apunte', () => {
  it('inicia en Recomendado con problemas elegidos y descarta preferencias de otra visita', () => {
    const stored = serializeNotesPreferences({mode:'personalizado',custom:{'cpp-map':off,'cpp-set':off}});
    const restored = restoreNotesPreferences(stored, null, chunks, ['problema-nuevo']);
    expect(restored).toEqual({mode:'recomendado',custom:null});
    expect(activeNotesSelection(restored, ['cpp-set', 'cpp-find'], chunks)).toEqual(presetSelection('recomendado', ['cpp-set', 'cpp-find'], chunks));
    expect(restoreNotesPreferences(serializeNotesPreferences({mode:'funciones',custom:null}), null, chunks, ['problema-nuevo']).mode).toBe('recomendado');
  });
  it('reúne las herramientas compartidas y excluye problemas fuera de alcance', () => {
    expect(recommendedChunkIds(problems)).toEqual(['cpp-set', 'cpp-find']);
    expect(presetSelection('completo', recommendedChunkIds(problems), chunks)).not.toHaveProperty('cpp-map');
    expect(presetSelection('completo', ['cpp-antiguo', 'cpp-set', 'cpp-set', 'cpp-plantilla'], chunks)).toEqual({
      'cpp-set': { descripcion: true, operaciones: true, ejemplos: true },
      'cpp-plantilla': { descripcion: true, operaciones: true, ejemplos: true },
    });
  });

  it('recalcula los modos automáticos cuando cambia la selección de problemas', () => {
    for (const mode of ['recomendado', 'completo', 'funciones'] as const) {
      const preferences = { mode, custom: { 'cpp-map': off } };
      expect(activeNotesSelection(preferences, ['cpp-set'], chunks)).toHaveProperty('cpp-set');
      const updated = activeNotesSelection(preferences, ['cpp-find'], chunks);
      expect(updated).toHaveProperty('cpp-find');
      expect(updated).not.toHaveProperty('cpp-set');
      expect(updated).not.toHaveProperty('cpp-map');
    }
    expect(presetSelection('recomendado', ['cpp-set'], chunks)['cpp-set']).toEqual({ descripcion: true, operaciones: true, ejemplos: false });
    expect(presetSelection('funciones', ['cpp-set'], chunks)['cpp-set']).toEqual({ descripcion: false, operaciones: true, ejemplos: false });
  });

  it('conserva un borrador personalizado, incluso vacío, al cambiar de modo y recargar', () => {
    let preferences: NotesPreferences = { mode: 'recomendado', custom: null };
    preferences = switchNotesMode(preferences, 'personalizado', presetSelection('recomendado', ['cpp-set'], chunks));
    expect(preferences.custom).toHaveProperty('cpp-set');
    preferences.custom = { 'cpp-set': off };
    preferences = switchNotesMode(preferences, 'completo', preferences.custom);
    preferences = restoreNotesPreferences(serializeNotesPreferences(preferences), null, chunks);
    preferences = switchNotesMode(preferences, 'personalizado', activeNotesSelection(preferences, ['cpp-find'], chunks));
    expect(activeNotesSelection(preferences, ['cpp-find'], chunks)).toEqual({ 'cpp-set': off });
    expect(switchNotesMode({ mode: 'funciones', custom: {} }, 'personalizado', { 'cpp-find': off }).custom).toEqual({});
  });

  it('migra los desmarcados anteriores y descarta configuraciones corruptas', () => {
    const legacy = JSON.stringify({ version: 1, selection: { 'cpp-set': off, 'cpp-antiguo': off } });
    expect(restoreNotesPreferences(null, legacy, chunks)).toEqual({ mode: 'personalizado', custom: { 'cpp-set': off } });
    expect(restoreNotesPreferences('no json', legacy, chunks).custom).toEqual({ 'cpp-set': off });
    expect(restoreNotesPreferences('{"version":2,"mode":"no existe","custom":[]}', null, chunks)).toEqual({ mode: 'recomendado', custom: null });
    expect(restoreNotesPreferences('{"version":2,"mode":"funciones","custom":null}', legacy, chunks)).toEqual({ mode: 'funciones', custom: null });
  });
});
