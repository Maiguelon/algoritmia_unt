import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { problems, tournaments, validateDataset } from '../src/lib/data';
import type { Problem, Tournament } from '../src/lib/types';

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

  it('admite información desconocida como null y no como cero', () => {
    const unknown: Tournament = { ...tournaments[0], id: 'torneo-pendiente', totalTeams: null, status: 'pendiente', distribution: [] };
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
  });

  it('TAP usa el tablero del torneo y no el contador del Gym de práctica', () => {
    const tap = tournaments.find(t => t.id === 'tap-2026');
    expect(tap?.totalTeams).toBe(186);
    const actual = problems.filter(p => p.tournamentId === 'tap-2026');
    expect(actual).toHaveLength(14);
    expect(actual.find(p => p.letter === 'B')?.ac).toBe(69);
    expect(actual.find(p => p.letter === 'J')?.ac).toBe(4);
    expect(tap?.untResults.find(t => t.team === 'Computops')?.rank).toBe(55);
  });

  it('Regional 2026 sigue pendiente y no inventa problemas ni estadísticas', () => {
    const pending = tournaments.find(t => t.id === 'regional-2026');
    expect(pending?.status).toBe('pendiente');
    expect(pending?.totalTeams).toBeNull();
    expect(pending?.distribution).toEqual([]);
    expect(problems.filter(p => p.tournamentId === 'regional-2026')).toEqual([]);
  });
});
