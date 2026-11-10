import type { Problem } from './types';
export const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const percentage = (p: Pick<Problem,'ac'|'total'>) => p.ac !== null && p.total !== null && p.total > 0 ? p.ac / p.total : null;
export function filterProblems(items: Problem[], filters: { q: string; tournament: string; difficulty: string; topic: string; sort: string }) {
  const found = items.filter(p => (!filters.q || normalize(`${p.title} ${p.letter} ${p.topics.join(' ')}`).includes(normalize(filters.q))) && (!filters.tournament || p.tournamentId === filters.tournament) && (!filters.difficulty || p.difficulty === filters.difficulty) && (!filters.topic || p.topics.includes(filters.topic)));
  return found.sort((a,b) => {
    if (filters.sort === 'nombre') return a.title.localeCompare(b.title, 'es');
    const av = filters.sort === 'ac' ? a.ac : percentage(a);
    const bv = filters.sort === 'ac' ? b.ac : percentage(b);
    if (av === null && bv !== null) return 1;
    if (bv === null && av !== null) return -1;
    return (bv ?? 0) - (av ?? 0) || a.id.localeCompare(b.id);
  });
}
export function readSelected(raw: string | null, allowed: string[]): string[] {
  try { const parsed: unknown = JSON.parse(raw ?? '[]'); return Array.isArray(parsed) ? [...new Set(parsed.filter((x): x is string => typeof x === 'string' && allowed.includes(x)))] : []; } catch { return []; }
}
