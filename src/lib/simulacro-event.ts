export type SimulacroPhase = 'before' | 'live' | 'after';
export type SimulacroEntry = { name: string; handle: string };

export type SimulacroEvent = {
  id: string;
  title: string;
  startsAt: number;
  endsAt: number;
  serverNow: number;
  phase: SimulacroPhase;
  problemCount: number;
  entries: SimulacroEntry[];
};

export type SimulacroAnnouncement = Omit<SimulacroEvent, 'entries' | 'problemCount' | 'phase'> & {
  phase: Exclude<SimulacroPhase, 'after'>;
};

export function simulacroPhase(startsAt: number, endsAt: number, now: number): SimulacroPhase {
  if (now < startsAt) return 'before';
  return now < endsAt ? 'live' : 'after';
}

export function simulacroApi(id: string): string {
  return '/api/simulacros/' + encodeURIComponent(id);
}
