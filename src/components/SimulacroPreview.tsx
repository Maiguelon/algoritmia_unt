import { useState, type SubmitEvent } from 'react';
import type { Chunk } from '../lib/chunks';
import type { Selection } from '../lib/composition';
import type { Problem, Tournament } from '../lib/types';

type Phase = 'before' | 'live' | 'after';
type Entry = { name: string; handle: string };
type Run = { handle: string; letter: string; minute: number; accepted: boolean };
type Material = 'statements' | 'reference' | 'set';

const phases: { id: Phase; label: string }[] = [
  { id: 'before', label: 'Antes de empezar' },
  { id: 'live', label: 'En vivo' },
  { id: 'after', label: 'Finalizado' },
];
const duration = 120;
const initialMinute = 42;
const demoEntries: Entry[] = [
  { name: 'Achilata', handle: 'achilata_demo' },
  { name: 'Los Recursivos', handle: 'recursivos_demo' },
  { name: 'Segfault al Fondo', handle: 'segfault_demo' },
  { name: 'Modo Debug', handle: 'debug_demo' },
  { name: 'Vale', handle: 'vale_demo' },
  { name: 'Los Iteradores', handle: 'iteradores_demo' },
];
const demoRuns: Run[] = [
  { handle: 'recursivos_demo', letter: 'A', minute: 6, accepted: true },
  { handle: 'achilata_demo', letter: 'A', minute: 7, accepted: true },
  { handle: 'segfault_demo', letter: 'A', minute: 8, accepted: true },
  { handle: 'debug_demo', letter: 'A', minute: 12, accepted: true },
  { handle: 'achilata_demo', letter: 'B', minute: 16, accepted: false },
  { handle: 'vale_demo', letter: 'A', minute: 18, accepted: true },
  { handle: 'debug_demo', letter: 'B', minute: 20, accepted: false },
  { handle: 'recursivos_demo', letter: 'B', minute: 24, accepted: true },
  { handle: 'segfault_demo', letter: 'D', minute: 27, accepted: true },
  { handle: 'achilata_demo', letter: 'B', minute: 29, accepted: true },
  { handle: 'vale_demo', letter: 'C', minute: 31, accepted: false },
  { handle: 'iteradores_demo', letter: 'B', minute: 32, accepted: false },
  { handle: 'achilata_demo', letter: 'C', minute: 34, accepted: false },
  { handle: 'debug_demo', letter: 'B', minute: 34, accepted: true },
  { handle: 'recursivos_demo', letter: 'D', minute: 35, accepted: false },
  { handle: 'achilata_demo', letter: 'D', minute: 39, accepted: true },
];
const nextRuns: Run[] = [
  { handle: 'recursivos_demo', letter: 'D', minute: 46, accepted: true },
  { handle: 'achilata_demo', letter: 'C', minute: 58, accepted: true },
  { handle: 'vale_demo', letter: 'B', minute: 76, accepted: true },
  { handle: 'iteradores_demo', letter: 'B', minute: 91, accepted: true },
];

interface Props {
  problems: (Problem & { judgeUrl: string })[];
  tournaments: Tournament[];
  chunks: Chunk[];
  referenceNotes: Selection;
  setNotes: Selection;
}

function getScoreboard(entries: Entry[], runs: Run[], problems: Props['problems']) {
  return entries.map(entry => {
    const cells = problems.map(({ letter }) => {
      const attempts = runs.filter(run => run.handle === entry.handle && run.letter === letter);
      const acceptedIndex = attempts.findIndex(run => run.accepted);
      const minute = acceptedIndex === -1 ? null : attempts[acceptedIndex].minute;
      const rejected = acceptedIndex === -1 ? attempts.length : acceptedIndex;
      return { letter, minute, rejected };
    });
    const solved = cells.filter(cell => cell.minute !== null);
    const penalty = solved.reduce((total, cell) => total + cell.minute! + cell.rejected * 20, 0);
    const lastAccepted = Math.max(0, ...solved.map(cell => cell.minute!));
    return { ...entry, cells, solved: solved.length, penalty, lastAccepted };
  }).sort((a, b) => b.solved - a.solved || a.penalty - b.penalty
    || a.lastAccepted - b.lastAccepted || a.name.localeCompare(b.name, 'es-AR'));
}

function displayTime(minutes: number) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [pad(Math.floor(minutes / 60)), pad(minutes % 60), '00'].join(':');
}

export default function SimulacroPreview({ problems, tournaments, chunks, referenceNotes, setNotes }: Props) {
  const [phase, setPhase] = useState<Phase>('live');
  const [entries, setEntries] = useState(demoEntries);
  const [simulated, setSimulated] = useState(0);
  const [latestEntry, setLatestEntry] = useState<Entry | null>(null);
  const [registrationError, setRegistrationError] = useState('');
  const [material, setMaterial] = useState<Material | null>(null);
  const [downloadError, setDownloadError] = useState('');
  const completed = phase === 'after';
  const upcoming = phase === 'before';
  const active = phase === 'live';
  const lastRun = simulated ? nextRuns[simulated - 1] : undefined;
  const elapsed = lastRun?.minute ?? initialMinute;
  const visibleRuns = upcoming ? [] : [...demoRuns, ...nextRuns.slice(0, completed ? nextRuns.length : simulated)];
  const rows = getScoreboard(entries, visibleRuns, problems);

  function register(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') ?? '').trim();
    const handle = String(values.get('handle') ?? '').trim().toLowerCase();
    setLatestEntry(null);
    if (!name || !/^[a-z0-9_.-]+$/.test(handle)) {
      setRegistrationError('Revisá el nombre y escribí el usuario de Codeforces sin espacios.');
      return;
    }
    if (entries.some(entry => entry.handle === handle)) {
      setRegistrationError('Ese usuario de Codeforces ya está anotado en este simulacro.');
      return;
    }
    const entry = { name, handle };
    setEntries(current => [...current, entry]);
    setRegistrationError('');
    setLatestEntry(entry);
    form.reset();
  }

  async function download(kind: Material) {
    setMaterial(kind);
    setDownloadError('');
    try {
      if (kind === 'statements') {
        const { downloadStatements } = await import('../lib/pdf-statements');
        await downloadStatements(problems, tournaments);
      } else {
        const { downloadNotes } = await import('../lib/pdf-notes');
        await downloadNotes(chunks, kind === 'reference' ? referenceNotes : setNotes);
      }
    } catch {
      setDownloadError('No se pudo preparar el PDF. Volvé a intentar.');
    } finally {
      setMaterial(null);
    }
  }

  return <div className="simulacro">
    <div className="sim-preview">
      <div>
        <strong>Vista de prueba</strong>
        <span>Horario, inscripciones y envíos de muestra.</span>
      </div>
      <div className="sim-phases" role="group" aria-label="Momento del simulacro">
        {phases.map(item => <button key={item.id} type="button" aria-pressed={phase === item.id} onClick={() => setPhase(item.id)}>{item.label}</button>)}
      </div>
    </div>

    <header className="sim-hero">
      <div>
        <p className="sim-date"><time dateTime="2026-11-18">Miércoles 18 de noviembre</time><span>16:00–18:00 · Hora argentina</span></p>
        <h1>Simulacro del miércoles</h1>
        <p className="sim-intro">En la FACET o desde casa. Participá por tu cuenta o en equipo.</p>
        {upcoming ? <a className="sim-mobile-jump" href="#inscripcion">Ir a la inscripción ↓</a> : <a className="sim-mobile-jump" href="#material">Ir a los problemas ↓</a>}
      </div>
      <div className="sim-clock">
        <p className="sim-clock-status" data-phase={phase}>{active ? 'En vivo' : upcoming ? 'Inscripción abierta' : 'Finalizado'}</p>
        <strong>{active ? displayTime(duration - elapsed) : upcoming ? '16:00' : '2 horas'}</strong>
        <span>{active ? 'Tiempo restante' : upcoming ? 'Hora de inicio' : 'Duración del simulacro'}</span>
        {active && <progress max={duration} value={elapsed} aria-label="Tiempo transcurrido"/>}
      </div>
    </header>

    <div className="sim-layout">
      <section className="sim-panel sim-ranking" id="marcador" aria-labelledby="sim-ranking-title">
        <div className="sim-ranking-header">
          <div>
            <h2 id="sim-ranking-title">{completed ? 'Marcador final' : 'Marcador'}</h2>
            <p>{entries.length} inscripciones · {problems.length} problemas</p>
          </div>
          {active && <button className="button secondary small" type="button" disabled={simulated === nextRuns.length} onClick={() => setSimulated(count => count + 1)}>Simular un envío</button>}
        </div>
        {active && <p className="sim-update" role="status">{lastRun
          ? demoEntries.find(entry => entry.handle === lastRun.handle)?.name + ' resolvió ' + lastRun.letter + ' en el minuto ' + lastRun.minute + '.'
          : 'Marcador de muestra al minuto ' + initialMinute + '.'}</p>}
        <div className="sim-table-scroll" role="region" aria-label="Tabla del marcador" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col" aria-label="Puesto">#</th><th scope="col">Participante</th><th scope="col">AC</th><th scope="col">Penal.</th>
                {problems.map(problem => <th key={problem.id} scope="col">
                  {upcoming ? problem.letter : <a href={'#sim-problem-' + problem.letter} title={problem.title}>{problem.letter}</a>}
                </th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const firstAtRank = rows.findIndex(entry => entry.solved === row.solved && entry.penalty === row.penalty && entry.lastAccepted === row.lastAccepted);
                return <tr key={row.handle} className={row.handle === latestEntry?.handle ? 'sim-new-entry' : undefined}>
                  <td className="sim-rank">{upcoming ? '–' : firstAtRank + 1}</td>
                  <th scope="row" className="sim-team">{row.name}</th>
                  <td className="sim-total">{row.solved}</td><td className="sim-penalty">{row.penalty}</td>
                  {row.cells.map(({ letter, minute, rejected }) => <td key={letter}>
                    {minute !== null ? <span className="sim-cell sim-cell-ac" title={rejected ? 'AC con ' + rejected + ' intentos penalizados' : 'AC al primer intento'}><b>{minute}′</b>{rejected > 0 && <small>+{rejected}</small>}</span>
                      : rejected > 0 ? <span className="sim-cell sim-cell-wa" title={rejected + ' intentos sin AC'}>−{rejected}</span>
                        : <span className="sim-cell sim-cell-empty">–</span>}
                  </td>)}
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        <div className="sim-legend"><span><i className="sim-key-ac"></i> Aceptado · minuto y fallos</span><span><i className="sim-key-wa"></i> Intentos sin AC</span></div>
      </section>

      <div className="sim-side">
        <section className="sim-panel sim-material" id="material" aria-labelledby="sim-material-title">
          <h2 id="sim-material-title">Material del simulacro</h2>
          {upcoming && <p>Los enunciados y los enlaces se habilitan al empezar.</p>}
          <div className="sim-downloads">
            {!upcoming && <button type="button" className="button" disabled={material !== null} onClick={() => download('statements')}>{material === 'statements' ? 'Preparando PDF…' : 'Descargar enunciados ↓'}</button>}
            <button type="button" className="button secondary" disabled={material !== null} onClick={() => download('reference')}>{material === 'reference' ? 'Preparando PDF…' : 'Apunte de referencia ↓'}</button>
            {completed && <button type="button" className="button secondary" disabled={material !== null} onClick={() => download('set')}>{material === 'set' ? 'Preparando PDF…' : 'Apunte de estos problemas ↓'}</button>}
          </div>
          {downloadError && <p className="sim-error" role="alert">{downloadError}</p>}
          {!upcoming && <ol className="sim-problems">
            {problems.map(problem => <li key={problem.id} id={'sim-problem-' + problem.letter}>
              <span className="sim-letter" aria-hidden="true">{problem.letter}</span>
              <a href={problem.judgeUrl} target="_blank" rel="noreferrer" aria-label={'Abrir ' + problem.letter + '. ' + problem.title + ' en Codeforces'}>
                {problem.title}<span aria-hidden="true">↗</span>
              </a>
            </li>)}
          </ol>}
        </section>
        {!completed && <section className="sim-panel sim-signup" id="inscripcion" aria-labelledby="sim-signup-title">
          <h2 id="sim-signup-title">Anotate al simulacro</h2>
          <form onSubmit={register}>
            <label htmlFor="sim-name">Nombre para el marcador</label>
            <input id="sim-name" name="name" placeholder="Tu nombre o el de tu equipo" maxLength={45} required/>
            <label htmlFor="sim-handle">Usuario de Codeforces</label>
            <input id="sim-handle" name="handle" placeholder="Usuario de quien hace los envíos" maxLength={48} autoCapitalize="none" spellCheck={false} required/>
            <button className="button" type="submit">Anotarme <span aria-hidden="true">→</span></button>
          </form>
          {registrationError && <p className="sim-error" role="alert">{registrationError}</p>}
          {latestEntry && <p className="sim-success" role="status"><strong>{latestEntry.name}</strong> ya aparece en el marcador.</p>}
        </section>}
      </div>
    </div>
  </div>;
}
