import type { Chunk } from './chunks';
import type { Problem } from './types';
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

export function recommendedChunkIds(problems: Pick<Problem, 'chunkIds' | 'coverage'>[]): string[] {
  return [...new Set(problems.filter(problem => problem.coverage !== 'fuera de alcance').flatMap(problem => problem.chunkIds))];
}

export function presetSelection(mode: AutomaticMode, ids: string[], chunks: Pick<Chunk, 'id'>[]): Selection {
  const allowed = new Set(chunks.map(chunk => chunk.id));
  const selection: Selection = {};
  for (const id of ids) {
    if (id === TEMPLATE_ID || !allowed.has(id)) continue;
    selection[id] = {
      descripcion: mode !== 'funciones',
      operaciones: true,
      ejemplos: mode === 'completo',
    };
  }
  // The template code is always included by the PDF renderer, once and first.
  if (mode === 'completo') selection[TEMPLATE_ID] = { descripcion: true, operaciones: true, ejemplos: false };
  return selection;
}

export function activeNotesSelection(preferences: NotesPreferences, ids: string[], chunks: Pick<Chunk, 'id'>[]): Selection {
  return preferences.mode === 'personalizado'
    ? preferences.custom ?? {}
    : presetSelection(preferences.mode, ids, chunks);
}

export function switchNotesMode(preferences: NotesPreferences, mode: NotesMode, current: Selection): NotesPreferences {
  return { mode, custom: mode === 'personalizado' && preferences.custom === null ? current : preferences.custom };
}

export function restoreNotesPreferences(raw: string | null, legacyRaw: string | null, chunks: Pick<Chunk, 'id'>[]): NotesPreferences {
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
