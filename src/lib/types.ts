export type Difficulty = 'Inicial' | 'Consolidación' | 'Salto regional' | 'Avanzado';
export type VerificationStatus = 'verificado' | 'provisorio';
export type Coverage = 'completa' | 'parcial' | 'pendiente';

export interface Problem {
  id: string;
  tournamentId: string;
  letter: string;
  title: string;
  summary: string;
  topics: string[];
  difficulty: Difficulty;
  difficultyReason: string;
  implementation: string;
  conceptual: string;
  ac: number | null;
  total: number | null;
  judgeUrl: string | null;
  sourceUrl: string;
  statementUrl: string | null;
  chunkIds: string[];
  coverage: Coverage;
  missingTools: string[];
  hints: string[];
  status: VerificationStatus;
  approach: string;
  editorialUrl?: string | null;
  classificationConfidence?: string;
  firstSolve?: { minute: number; teams: string[] } | null;
  statementPages?: { start: number; end: number; sourcePageCount: number };
}

export interface Tournament {
  id: string;
  title: string;
  year: number;
  season: string;
  setName: string;
  population: string;
  totalTeams: number | null;
  status: VerificationStatus | 'pendiente';
  sources: Array<{ label: string; url: string }>;
  distribution: Array<{ solved: number; teams: number }>;
  notes: string[];
  tucumanResults: Array<{
    team: string;
    institution: string;
    solved: number;
    rank: number | null;
    note: string;
    qualifiedTo?: string;
  }>;
}
