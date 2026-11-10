import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { problems, tournaments, validateDataset } from '../src/lib/data';
import type { Problem, Tournament } from '../src/lib/types';
import regional2026Evidence from '../docs/investigacion/regional-2026-evidencia.json';
import tap2024Evidence from '../docs/investigacion/tap-2024-evidencia.json';
import tap2025Evidence from '../docs/investigacion/tap-2025-evidencia.json';

const copyProblems = () => structuredClone(problems);
const copyTournaments = () => structuredClone(tournaments);

describe('contratos del contenido editorial', () => {
  it('acepta el corpus y conserva la población South de cada edición', () => {
    expect(() => validateDataset()).not.toThrow();
    for (const tournament of tournaments.filter(t => t.distribution.length)) {
      expect(tournament.distribution.reduce((sum, row) => sum + row.teams, 0)).toBe(tournament.totalTeams);
    }
    expect(tournaments.find(t => t.id === 'regional-2025')?.totalTeams).toBe(201);
  });

  it('distingue estimación de dificultad y estadísticas verificadas', () => {
    const king = problems.find(p => p.id === 'regional-2025-k')!;
    expect(king.coverage).toBe('parcial');
    expect(king.missingTools.length).toBeGreaterThan(0);
    expect(king.classificationConfidence).toMatch(/Media/);
    expect(king.ac).toBe(24);
    expect(king.total).toBe(201);
  });

  it('rechaza IDs o letras repetidos', () => {
    expect(() => validateDataset([...problems, problems[0]], tournaments)).toThrow(/repetido/);
    expect(() => validateDataset([...problems, { ...problems[0], id: 'otro-id' }], tournaments)).toThrow(/Letra repetida/);
    expect(() => validateDataset(problems, [...tournaments, tournaments[0]])).toThrow(/Torneo repetido/);
  });

  it('mantiene Top global fuera de las sugerencias de apuntes', () => {
    const list = copyProblems();
    list[0].difficulty = 'Top global';
    expect(() => validateDataset(list, tournaments)).toThrow(/fuera de alcance con apuntes/);
    list[0].coverage = 'fuera de alcance';
    list[0].chunkIds = [];
    expect(() => validateDataset(list, tournaments)).not.toThrow();
  });

  it('rechaza referencias rotas a torneos y bloques', () => {
    const list = copyProblems();
    list[0].tournamentId = 'inexistente';
    list[0].chunkIds = ['cpp-no-existe'];
    expect(() => validateDataset(list, tournaments)).toThrow(/Torneo inexistente/);
    expect(() => validateDataset(list, tournaments)).toThrow(/Bloque inexistente/);
  });

  it('rechaza AC imposibles y denominadores cero', () => {
    const list = copyProblems();
    list[0].ac = list[0].total! + 1;
    expect(() => validateDataset(list, tournaments)).toThrow(/AC fuera del total/);
    list[0].ac = 0;
    list[0].total = 0;
    expect(() => validateDataset(list, tournaments)).toThrow(/Denominador inválido/);
  });

  it('rechaza una distribución cuyo total no coincide', () => {
    const list = copyTournaments();
    const complete = list.find(t => t.distribution.length)!;
    complete.distribution[0].teams += 1;
    expect(() => validateDataset(problems, list)).toThrow(/distribución no coincide/);
  });

  it('exige cantidad y fuente para los cupos o clasificados del torneo', () => {
    const list = copyTournaments();
    const tap = list.find(t => t.id === 'tap-2026')!;
    tap.qualification!.count = -1;
    expect(() => validateDataset(problems, list)).toThrow(/Clasificación sin datos o fuente válidos/);
    tap.qualification!.count = 55;
    tap.qualification!.sourceUrl = 'https://ejemplo.org/sin-respaldo';
    expect(() => validateDataset(problems, list)).toThrow(/Clasificación sin datos o fuente válidos/);
  });

  it('contrasta las rutas con la distribución y las letras del torneo', () => {
    const list = copyTournaments();
    const analysis = list.find(t => t.id === 'tap-2026')!.qualificationAnalysis!;
    analysis.cohort.combinations[0].teams += 1;
    expect(() => validateDataset(problems, list)).toThrow(/Rutas de clasificación inconsistentes/);
    analysis.cohort.combinations[0].teams -= 1;
    analysis.cutoff.solvedProblems[0] = 'Z';
    expect(() => validateDataset(problems, list)).toThrow(/Corte de clasificación inválido/);
    analysis.cutoff.solvedProblems[0] = 'A';
    analysis.cutoff.rank = 19;
    expect(() => validateDataset(problems, list)).toThrow(/Corte de clasificación inválido/);
    analysis.cutoff.rank = 20;
    analysis.ruleSourceUrl = 'https://ejemplo.org/reglas-sin-respaldo';
    expect(() => validateDataset(problems, list)).toThrow(/Análisis de clasificación sin fuentes/);
  });

  it('admite información desconocida como null y no como cero', () => {
    const unknown: Tournament = { ...tournaments[0], id: 'torneo-pendiente', totalTeams: null, status: 'pendiente', distribution: [], qualification: undefined, qualificationAnalysis: undefined, statementBooklet: undefined, tucumanResults: [] };
    const problem: Problem = { ...problems[0], id: 'problema-provisorio', tournamentId: unknown.id, status: 'provisorio', ac: null, total: null, judgeUrl: null, statementUrl: null, statementPages: undefined };
    expect(() => validateDataset([problem], [unknown])).not.toThrow();
    expect(problem.ac).toBeNull();
  });

  it('rechaza páginas fuera del cuadernillo y enlaces inventados', () => {
    const list = copyProblems();
    list[0].statementPages = { start: 1, end: 9, sourcePageCount: 8 };
    list[0].judgeUrl = 'no-es-una-url';
    expect(() => validateDataset(list, tournaments)).toThrow(/Páginas inválidas/);
    expect(() => validateDataset(list, tournaments)).toThrow(/Enlace inválido/);
  });

  it('solo ofrece PDF locales que existen', () => {
    for (const problem of problems) {
      if (problem.statementUrl) expect(existsSync(resolve('public', problem.statementUrl.slice(1)))).toBe(true);
    }
    for (const tournament of tournaments) {
      if (tournament.statementBooklet) expect(existsSync(resolve('public', tournament.statementBooklet.url.slice(1)))).toBe(true);
    }
  });

  it('TAP usa el tablero del torneo y no el contador del Gym de práctica', () => {
    const tap = tournaments.find(t => t.id === 'tap-2026');
    expect(tap?.totalTeams).toBe(186);
    const actual = problems.filter(p => p.tournamentId === 'tap-2026');
    expect(actual).toHaveLength(14);
    expect(actual.find(p => p.letter === 'B')?.ac).toBe(69);
    expect(actual.find(p => p.letter === 'J')?.ac).toBe(4);
    expect(tap?.tucumanResults.find(t => t.team === 'Computops')?.rank).toBe(55);
  });

  it('Regional 2026 conserva South y sus AC sin inventar un Gym', () => {
    const tournament = tournaments.find(t => t.id === 'regional-2026')!;
    const set = problems.filter(p => p.tournamentId === tournament.id);
    expect(tournament.totalTeams).toBe(214);
    expect(set).toHaveLength(13);
    expect(tournament.judgeUrl).toBeUndefined();
    expect(tournament.qualification?.count).toBe(19);
    expect(tournament.qualification?.provisional).toBe(true);
    expect(tournament.tucumanResults.find(t => t.team === 'Mono Pollo NP++ 18')?.solvedProblems).toEqual(['D','G','J']);
    for (const problem of set) {
      expect(problem.judgeUrl).toBeNull();
      const accepted = regional2026Evidence.teams.filter(team => problem.letter in team.accepted);
      expect(problem.ac).toBe(accepted.length);
      expect(problem.total).toBe(regional2026Evidence.totalSouth);
    }
  });

  it('TAP 2024 y 2025 reconcilian cada AC y primera resolución con sus equipos publicados', () => {
    for (const evidence of [tap2024Evidence, tap2025Evidence]) {
      const tournament = tournaments.find(t => t.id === evidence.id)!;
      const set = problems.filter(p => p.tournamentId === evidence.id);
      expect(set).toHaveLength(14);
      expect(evidence.teams).toHaveLength(tournament.totalTeams!);
      expect(evidence.distribution.reduce((sum, row) => sum + row.teams, 0)).toBe(tournament.totalTeams);
      expect(set.reduce((sum, problem) => sum + problem.ac!, 0)).toBe(evidence.teams.reduce((sum, team) => sum + team.solved, 0));
      for (const team of evidence.teams) expect(team.solvedProblems).toHaveLength(team.solved);
      for (const problem of set) {
        const accepted = evidence.teams.filter(team => (team.solvedProblems as string[]).includes(problem.letter));
        expect(problem.ac).toBe(accepted.length);
        expect(problem.total).toBe(tournament.totalTeams);
        const times = accepted.map(team => (team.acceptedMinutes as Record<string, number>)[problem.letter]);
        expect(problem.firstSolve?.minute ?? null).toBe(times.length ? Math.min(...times) : null);
      }
    }
  });

  it('excluye los dos AC ajenos de TAP 2025 y no inventa cifras para el resultado UNT en conflicto', () => {
    const set = problems.filter(p => p.tournamentId === 'tap-2025');
    expect(set.find(p => p.letter === 'A')?.ac).toBe(175);
    expect(set.find(p => p.letter === 'G')?.ac).toBe(181);
    expect(tap2025Evidence.teams.some(team => team.name === 'CCL Soarch 4')).toBe(false);
    expect(tap2025Evidence.teams.find(team => team.name === 'Root')?.solvedProblems).toEqual([]);
    const conflicting = tournaments.find(t => t.id === 'tap-2024')!.tucumanResults.find(team => team.team === 'La tupla del gordo silla')!;
    expect(conflicting.rank).toBe(76);
    expect(conflicting.solved).toBeNull();
    expect(conflicting.solvedProblems).toBeUndefined();
    expect(tournaments.find(t => t.id === 'tap-2025')?.tucumanQualificationVerified).toBe(false);
    expect(tournaments.find(t => t.id === 'tap-2025')?.qualificationAnalysis?.cutoff.team).toBe('TAPires');
    expect(tournaments.find(t => t.id === 'tap-2025')?.qualificationAnalysis?.cutoff.rank).toBe(19);
  });
});
