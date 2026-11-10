import type { Chunk } from './chunks';

export const TEMPLATE_ID = 'cpp-plantilla';
export const SECTION_KEYS = ['descripcion', 'operaciones', 'ejemplos'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];
export type SectionSelection = Record<SectionKey, boolean>;
export type Selection = Record<string, SectionSelection>;

export const SECTION_LABELS: Record<SectionKey, string> = {
  descripcion: 'Descripción',
  operaciones: 'Funciones y operaciones',
  ejemplos: 'Ejemplos',
};

export function defaultSections(): SectionSelection {
  return { descripcion: false, operaciones: true, ejemplos: false };
}

export function hasAnySection(parts: SectionSelection | undefined): boolean {
  return Boolean(parts && SECTION_KEYS.some((key) => parts[key]));
}

/** Preserves explicit removals, while dropping stale IDs and non-boolean values. */
export function sanitizeSelection(value: unknown, chunks: Pick<Chunk, 'id'>[]): Selection {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const allowed = new Set(chunks.map((chunk) => chunk.id));
  const selection: Selection = {};
  for (const [id, parts] of Object.entries(value)) {
    if (!allowed.has(id) || !parts || typeof parts !== 'object' || Array.isArray(parts)) continue;
    const candidate = parts as Record<string, unknown>;
    selection[id] = {
      descripcion: candidate.descripcion === true,
      operaciones: candidate.operaciones === true,
      ejemplos: candidate.ejemplos === true,
    };
  }
  return selection;
}

export function parseStoredSelection(raw: string | null, chunks: Pick<Chunk, 'id'>[]): Selection | null {
  if (raw === null) return null;
  try {
    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return null;
    const record = stored as Record<string, unknown>;
    if (record.version !== 1 || !record.selection || typeof record.selection !== 'object' || Array.isArray(record.selection)) return null;
    return sanitizeSelection(record.selection, chunks);
  } catch {
    return null;
  }
}

export function suggestedSelection(ids: string[], chunks: Pick<Chunk, 'id'>[]): Selection {
  const allowed = new Set(chunks.map((chunk) => chunk.id));
  const selection: Selection = {};
  for (const id of ids) {
    if (id !== TEMPLATE_ID && allowed.has(id)) selection[id] = defaultSections();
  }
  return selection;
}

/** Suggestions are added only after an explicit action, never during restoration. */
export function addSuggestedSelection(selection: Selection, ids: string[], chunks: Pick<Chunk, 'id'>[]): Selection {
  const additions = suggestedSelection(ids, chunks);
  const next = { ...selection };
  for (const [id, parts] of Object.entries(additions)) {
    if (!hasAnySection(next[id])) next[id] = parts;
  }
  return next;
}

export function selectedContentChunks(chunks: Chunk[], selection: Selection): Chunk[] {
  const seen = new Set<string>();
  return chunks.filter((chunk) => {
    if (chunk.id === TEMPLATE_ID || seen.has(chunk.id) || !hasAnySection(selection[chunk.id])) return false;
    seen.add(chunk.id);
    return true;
  });
}

export function hasIndex(chunks: Chunk[], selection: Selection): boolean {
  return selectedContentChunks(chunks, selection).length > 1;
}

export function suggestedPrerequisites(chunks: Chunk[], selection: Selection): Chunk[] {
  const ids = new Set(selectedContentChunks(chunks, selection).flatMap((chunk) => chunk.suggestedPrerequisites));
  return chunks.filter((chunk) => chunk.id !== TEMPLATE_ID && ids.has(chunk.id) && !hasAnySection(selection[chunk.id]));
}
