import type { StatementProblem } from './statement-index';

export function spanishStatementUrl(problem: StatementProblem): string | null {
  return problem.spanishStatementUrl ?? (problem.tournamentId.startsWith('tap-') ? problem.statementUrl : null);
}

export function preferSpanishStatement(problem: StatementProblem): StatementProblem {
  const spanishUrl = spanishStatementUrl(problem);
  return spanishUrl
    ? { ...problem, statementUrl: spanishUrl, statementLanguage: 'es' }
    : { ...problem, statementLanguage: 'en' };
}
