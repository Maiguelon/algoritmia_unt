import { useSyncExternalStore } from 'react';
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

const preferenceKey = 'algoritmia:statements:language';
const preferenceEvent = 'algoritmia:statement-language';
let memoryPreference = false;
let memoryOnly = false;

export function prefersSpanishStatements(): boolean {
  if (memoryOnly) return memoryPreference;
  try { return localStorage.getItem(preferenceKey) === 'es'; }
  catch { return memoryPreference; }
}

export function setPreferSpanishStatements(enabled: boolean): void {
  memoryPreference = enabled;
  try {
    localStorage.setItem(preferenceKey, enabled ? 'es' : 'original');
    memoryOnly = false;
  } catch {
    memoryOnly = true;
  }
  window.dispatchEvent(new Event(preferenceEvent));
}

function subscribe(notify: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === preferenceKey || event.key === null) notify();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(preferenceEvent, notify);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(preferenceEvent, notify);
  };
}

export function usePreferSpanishStatements(): boolean {
  return useSyncExternalStore(subscribe, prefersSpanishStatements, () => false);
}
