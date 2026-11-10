import type { Problem, Tournament } from './types';
import catalog from '../../content/apuntes/cpp/catalogo.json';

const problemFiles = import.meta.glob<Problem>('../../content/problems/*.json', { eager: true, import: 'default' });
const tournamentFiles = import.meta.glob<Tournament>('../../content/tournaments/*.json', { eager: true, import: 'default' });

export const problems: Problem[] = Object.values(problemFiles).sort((a, b) => a.id.localeCompare(b.id));
export const tournaments: Tournament[] = Object.values(tournamentFiles).sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

const difficulties = ['Inicial', 'Consolidación', 'Salto regional', 'Avanzado'];
const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0;
const isWebUrl = (value: unknown): value is string => typeof value === 'string' && /^https:\/\//.test(value);

/** Throws with all editorial/data errors, so invalid content cannot silently ship. */
export function validateDataset(
  problemList: Problem[] = problems,
  tournamentList: Tournament[] = tournaments,
  chunkIds: string[] = catalog.chunks.map(chunk => chunk.id),
): void {
  const errors: string[] = [];
  const knownChunks = new Set(chunkIds);
  const tournamentMap = new Map<string, Tournament>();
  for (const tournament of tournamentList) {
    if (tournamentMap.has(tournament.id)) errors.push(`Torneo repetido: ${tournament.id}`);
    tournamentMap.set(tournament.id, tournament);
    if (!tournament.id || !tournament.title || !Number.isInteger(tournament.year)) errors.push(`Torneo inválido: ${tournament.id}`);
    if (tournament.totalTeams !== null && (!isCount(tournament.totalTeams) || tournament.totalTeams === 0)) errors.push(`Total de equipos inválido: ${tournament.id}`);
    if (!['verificado', 'provisorio', 'pendiente'].includes(tournament.status)) errors.push(`Estado inválido: ${tournament.id}`);
    if (tournament.sources.some(source => !source.label || !isWebUrl(source.url))) errors.push(`Fuente inválida: ${tournament.id}`);
    if (tournament.distribution.some(row => !isCount(row.solved) || !isCount(row.teams))) errors.push(`Distribución inválida: ${tournament.id}`);
    if (new Set(tournament.distribution.map(row => row.solved)).size !== tournament.distribution.length) errors.push(`Distribución repetida: ${tournament.id}`);
    if (tournament.distribution.length && tournament.distribution.reduce((sum, row) => sum + row.teams, 0) !== tournament.totalTeams) errors.push(`La distribución no coincide con el total: ${tournament.id}`);
  }
  const seen = new Set<string>();
  const seenLetters = new Set<string>();
  for (const problem of problemList) {
    const label = problem.id || '(sin ID)';
    if (seen.has(problem.id)) errors.push(`Problema repetido: ${label}`);
    seen.add(problem.id);
    const letterKey = `${problem.tournamentId}:${problem.letter}`;
    if (seenLetters.has(letterKey)) errors.push(`Letra repetida en el torneo: ${label}`);
    seenLetters.add(letterKey);
    const tournament = tournamentMap.get(problem.tournamentId);
    if (!tournament) errors.push(`Torneo inexistente: ${label}`);
    if (!problem.id || !/^[A-Z]$/.test(problem.letter) || !problem.title || !problem.summary || !problem.difficultyReason || !problem.approach) errors.push(`Ficha incompleta: ${label}`);
    if (!difficulties.includes(problem.difficulty)) errors.push(`Dificultad inválida: ${label}`);
    if (!['verificado', 'provisorio'].includes(problem.status)) errors.push(`Estado inválido: ${label}`);
    if (!['completa', 'parcial', 'pendiente'].includes(problem.coverage)) errors.push(`Cobertura inválida: ${label}`);
    if (problem.coverage === 'completa' && problem.missingTools.length) errors.push(`Cobertura contradictoria: ${label}`);
    if (problem.ac !== null && !isCount(problem.ac)) errors.push(`AC inválido: ${label}`);
    if (problem.total !== null && (!isCount(problem.total) || problem.total === 0)) errors.push(`Denominador inválido: ${label}`);
    if (problem.ac !== null && (problem.total === null || problem.ac > problem.total)) errors.push(`AC fuera del total: ${label}`);
    if (tournament && problem.total !== tournament.totalTeams) errors.push(`Población inconsistente: ${label}`);
    if (!isWebUrl(problem.sourceUrl) || (problem.judgeUrl !== null && !isWebUrl(problem.judgeUrl))) errors.push(`Enlace inválido: ${label}`);
    if (problem.statementUrl !== null && !/^\/statements\/[a-z0-9-]+\.pdf$/.test(problem.statementUrl)) errors.push(`Enunciado inválido: ${label}`);
    if (new Set(problem.chunkIds).size !== problem.chunkIds.length) errors.push(`Bloque repetido: ${label}`);
    for (const chunkId of problem.chunkIds) if (!knownChunks.has(chunkId)) errors.push(`Bloque inexistente ${chunkId}: ${label}`);
    if (problem.statementPages) {
      const { start, end, sourcePageCount } = problem.statementPages;
      if (![start, end, sourcePageCount].every(isCount) || start < 1 || end < start || end > sourcePageCount) errors.push(`Páginas inválidas: ${label}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

validateDataset();
