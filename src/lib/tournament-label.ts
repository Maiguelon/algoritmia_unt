import type { Tournament } from './types';

/** Etiqueta compacta para listas; la ficha conserva el nombre oficial. */
export function tournamentLabel(tournament: Pick<Tournament, 'id' | 'year' | 'title'>): string {
  if (tournament.id.startsWith('tap-')) return `TAP ${tournament.year}`;
  if (tournament.id.startsWith('regional-')) return `Regional ${tournament.year}`;
  return tournament.title;
}
