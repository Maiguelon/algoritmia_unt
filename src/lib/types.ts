export const DIFFICULTIES = ['Inicial', 'Consolidación', 'Salto regional', 'Avanzado', 'Top global'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export type VerificationStatus = 'verificado' | 'provisorio';
export type Coverage = 'completa' | 'parcial' | 'pendiente' | 'fuera de alcance';

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
  judgeUrl?: string;
  statementBooklet?: { url: string; sourceUrl: string };
  population: string;
  totalTeams: number | null;
  tucumanQualificationVerified?: boolean;
  tucumanQualificationKind?: 'aceptados';
  tucumanResultsNote?: string;
  qualification?: {
    count: number;
    kind: 'cupos' | 'clasificados';
    scope: string;
    target: string;
    sourceUrl: string;
    provisional?: boolean;
    context?: string;
  };
  qualificationAnalysis?: {
    rankLimit: number;
    institutionLimit: number;
    ruleSourceUrl: string;
    directQualification?: string;
    contextTitle?: string;
    cutoff: {
      team: string;
      institution: string;
      rank: number;
      solved: number;
      penalty: number;
      solvedProblems: string[];
      isDirect?: boolean;
      caption?: string;
      rankLabel?: string;
    };
    cohort: {
      solved: number;
      combinations: Array<{ teams: number; solvedProblems: string[] }>;
    };
    indirectQualification: string;
    cutoffContext: string[];
    requiredLevel: Difficulty;
    requiredLevelLabel?: string;
    preparation: Array<{
      title: string;
      items: Array<{ solvedProblems: string[]; tools: string }>;
    }>;
    evidenceSourceUrls: string[];
  };
  status: VerificationStatus | 'pendiente';
  sources: Array<{ label: string; url: string }>;
  distribution: Array<{ solved: number; teams: number }>;
  notes: string[];
  tucumanResults: Array<{
    team: string;
    institution: string;
    solved: number | null;
    rank: number | null;
    note: string;
    penalty?: number;
    solvedProblems?: string[];
    qualifiedTo?: string;
  }>;
}
