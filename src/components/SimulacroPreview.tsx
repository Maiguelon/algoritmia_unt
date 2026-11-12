import { useState, type SubmitEvent } from 'react';
import type { Chunk } from '../lib/chunks';
import { findCodeforcesHandle } from '../lib/codeforces';
import type { Selection } from '../lib/composition';
import type { Problem, Tournament } from '../lib/types';

type Phase = 'before' | 'live' | 'after';
type ProblemResult = { letter: string; minute: number | null; rejected: number };
type Entry = { name: string; handle: string };
type Run = { handle: string; letter: string; minute: number; accepted: boolean };
type Material = 'statements' | 'notes';

const phases: { id: Phase; label: string }[] = [
  { id: 'before', label: 'Antes de empezar' },
  { id: 'live', label: 'En vivo' },
  { id: 'after', label: 'Finalizado' },
];
const medals = ['oro', 'plata', 'bronce'];
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

function ScoreCell({ result, phase, animate }: { result: ProblemResult; phase: Phase; animate: boolean }) {
  const { letter, minute, rejected } = result;
  const solved = minute !== null;
  const attempts = rejected + (solved ? 1 : 0);
  const description = solved
    ? `Aceptado en el minuto ${minute}, ${attempts} ${attempts === 1 ? 'intento' : 'intentos'}`
    : attempts ? `${attempts} ${attempts === 1 ? 'intento' : 'intentos'} sin AC` : 'Sin intentos';
  const text = attempts ? (phase === 'after' ? `${attempts}/${minute ?? '–'}` : `−${attempts}`) : '–';

  return <td data-problem={letter} data-result={solved ? 'ac' : attempts ? 'wa' : undefined} title={description} aria-label={description}>
    {phase === 'live' && solved
      ? <span className="sim-balloon" data-new={animate || undefined} aria-hidden="true"/>
      : <span className="sim-cell">{text}</span>}
  </td>;
}

export default function SimulacroPreview({ problems, tournaments, chunks, setNotes }: Props) {
  const [phase, setPhase] = useState<Phase>('before');
  const [entries, setEntries] = useState(demoEntries);
  const [simulated, setSimulated] = useState(0);
  const [latestEntry, setLatestEntry] = useState<Entry | null>(null);
  const [registrationError, setRegistrationError] = useState('');
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [material, setMaterial] = useState<Material | null>(null);
  const [downloadError, setDownloadError] = useState('');
  const completed = phase === 'after';
  const upcoming = phase === 'before';
  const active = phase === 'live';
  const lastRun = simulated ? nextRuns[simulated - 1] : undefined;
  const elapsed = lastRun?.minute ?? initialMinute;
  const visibleRuns = upcoming ? [] : [...demoRuns, ...nextRuns.slice(0, completed ? nextRuns.length : simulated)];
  const rows = getScoreboard(entries, visibleRuns, problems);

  async function register(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checkingHandle) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') ?? '').trim();
    const handle = String(values.get('handle') ?? '').trim().toLowerCase();
    setLatestEntry(null);
    if (!name || !/^[a-z0-9_.-]+$/.test(handle)) {
      setRegistrationError('Revisá el nombre y escribí el usuario de Codeforces sin espacios.');
      return;
    }
    if (entries.some(entry => entry.handle.toLowerCase() === handle)) {
      setRegistrationError('Ese usuario de Codeforces ya está anotado en este simulacro.');
      return;
    }
    setRegistrationError('');
    setCheckingHandle(true);
    try {
      const currentHandle = await findCodeforcesHandle(handle);
      if (!currentHandle) {
        setRegistrationError('No encontramos ese usuario en Codeforces. Revisá cómo está escrito.');
        return;
      }
      const entry = { name, handle: currentHandle };
      setEntries(current => [...current, entry]);
      setLatestEntry(entry);
      form.reset();
    } catch {
      setRegistrationError('No pudimos consultar Codeforces. Volvé a intentar en unos segundos.');
    } finally {
      setCheckingHandle(false);
    }
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
        await downloadNotes(chunks, setNotes);
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

    <header className="sim-hero" data-phase={phase}>
      <div>
        <p className="sim-date">
          <time dateTime="2026-11-18">Miércoles 18 de noviembre</time>
          {upcoming && <span>16:00–18:00 · Hora argentina</span>}
        </p>
        <h1>Simulacro del miércoles</h1>
        {upcoming && <p className="sim-intro">En la FACET o desde casa. Participá por tu cuenta o en equipo.</p>}
        {!upcoming && <a className="sim-mobile-jump" href="#material">Ir a los problemas ↓</a>}
      </div>
      {active && <div className="sim-clock">
        <p className="sim-clock-status">En vivo</p>
        <strong>{displayTime(duration - elapsed)}</strong>
        <span>Tiempo restante</span>
        <progress max={duration} value={elapsed} aria-label="Tiempo transcurrido"/>
      </div>}
    </header>

    <div className="sim-layout" data-phase={phase}>
      {upcoming && <section className="sim-panel sim-signup" id="inscripcion" aria-labelledby="sim-signup-title">
        <h2 id="sim-signup-title">Anotate al simulacro</h2>
        <form onSubmit={register}>
          <label htmlFor="sim-name">Nombre para el marcador</label>
          <input id="sim-name" name="name" placeholder="Tu nombre o el de tu equipo" maxLength={45} readOnly={checkingHandle} required/>
          <div className="sim-handle-label">
            <label htmlFor="sim-handle">Usuario de Codeforces</label>
            <a href="https://codeforces.com/register" target="_blank" rel="noreferrer">¿No tenés cuenta? Creá una ↗</a>
          </div>
          <input id="sim-handle" name="handle" placeholder="Usuario de quien hace los envíos" maxLength={48} autoCapitalize="none" spellCheck={false} readOnly={checkingHandle} required/>
          <button className="button" type="submit" disabled={checkingHandle}>{checkingHandle ? 'Verificando usuario…' : 'Anotarme'} <span aria-hidden="true">→</span></button>
        </form>
        {registrationError && <p className="sim-error" role="alert">{registrationError}</p>}
        {latestEntry && <p className="sim-success" role="status"><strong>{latestEntry.name}</strong> quedó anotado. ¡No necesitás hacer nada más!</p>}
      </section>}
      {!upcoming && <section className="sim-panel sim-ranking" data-phase={phase} id="marcador" aria-labelledby="sim-ranking-title">
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
                <th scope="col" aria-label="Puesto">#</th><th scope="col">Participante</th>
                {problems.map(problem => <th key={problem.id} scope="col" data-problem={problem.letter}>
                  <a className="sim-problem-heading" href={'#sim-problem-' + problem.letter} title={problem.title}>
                    <span className="sim-balloon" aria-hidden="true"/>{problem.letter}
                  </a>
                </th>)}
                <th scope="col">AC</th><th scope="col">Penal.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const rank = rows.findIndex(entry => entry.solved === row.solved && entry.penalty === row.penalty && entry.lastAccepted === row.lastAccepted) + 1;
                const medal = completed ? medals[rank - 1] : undefined;
                return <tr key={row.handle} className={row.handle === latestEntry?.handle ? 'sim-new-entry' : undefined}>
                  <td className="sim-rank">
                    {medal
                      ? <span className="sim-medal" data-medal={medal} role="img" aria-label={`Puesto ${rank}, medalla de ${medal}`}>{rank}</span>
                      : rank}
                  </td>
                  <th scope="row" className="sim-team">{row.name}</th>
                  {row.cells.map(cell => <ScoreCell key={cell.letter} result={cell} phase={phase}
                    animate={lastRun?.handle === row.handle && lastRun.letter === cell.letter}/>)}
                  <td className="sim-total">{row.solved}</td><td className="sim-penalty">{row.penalty}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        <div className="sim-legend">
          {completed ? <>
            <span><b>2/37</b> 2 intentos, AC en el minuto 37</span><span><b>2/–</b> 2 intentos sin AC</span>
          </> : <>
            <span><i className="sim-balloon" aria-hidden="true"/> Problema aceptado</span><span><b>−2</b> 2 intentos sin AC</span>
          </>}
        </div>
      </section>}
      <div className="sim-material-stack">
        <section className="sim-panel sim-material" id="material" aria-labelledby="sim-material-title">
          <h2 id="sim-material-title">{upcoming ? 'Cómo se juega' : 'Material del simulacro'}</h2>
          {upcoming && <ol className="sim-how">
            <li>Descargá los enunciados al empezar.</li>
            <li>Resolvé y probá en tu editor.</li>
            <li>Enviá en Codeforces y seguí el marcador.</li>
          </ol>}
          <div className="sim-downloads">
            {!upcoming && <button type="button" className="button" disabled={material !== null} onClick={() => download('statements')}>{material === 'statements' ? 'Preparando PDF…' : 'Descargar enunciados ↓'}</button>}
            <button type="button" className="button secondary" disabled={material !== null} onClick={() => download('notes')}>{material === 'notes' ? 'Preparando PDF…' : 'Descargar apunte del simulacro ↓'}</button>
          </div>
          {downloadError && <p className="sim-error" role="alert">{downloadError}</p>}
          {!upcoming && <>
            <p className="sim-submit-help">Al enviar, elegí la letra del problema en Codeforces.</p>
            <ol className="sim-problems">
              {problems.map(problem => <li key={problem.id} id={'sim-problem-' + problem.letter}>
                <span className="sim-letter" data-problem={problem.letter} aria-hidden="true">{problem.letter}</span>
                <span className="sim-problem-title">{problem.title}</span>
                <a href={problem.judgeUrl} target="_blank" rel="noreferrer" aria-label={'Enviar ' + problem.letter + '. ' + problem.title + ' en Codeforces'}>
                  Enviar <span aria-hidden="true">↗</span>
                </a>
              </li>)}
            </ol>
          </>}
        </section>

        {upcoming && <section className="sim-panel sim-practice-invite" aria-labelledby="sim-practice-invite-title">
          <h2 id="sim-practice-invite-title">Probá un envío</h2>
          <p>¿Ya te anotaste? Practicá cómo enviar en Codeforces y ver tu resultado en el marcador.</p>
          <a className="button secondary" target="_blank" rel="noreferrer" href={latestEntry ? '/simulacro/prueba/?usuario=' + encodeURIComponent(latestEntry.handle) : '/simulacro/prueba/'}>Probar un envío →</a>
          <details>
            <summary>Cómo leer el marcador</summary>
            <ul>
              <li><strong>AC</strong> significa que el juez aceptó tu solución. En vivo aparece un globo.</li>
              <li><strong>2/37</strong> indica que el problema salió en el segundo intento, al minuto 37.</li>
              <li>El set combina problemas de entrada con otros que piden más técnica.</li>
            </ul>
          </details>
        </section>}
      </div>

      {upcoming && <section className="sim-panel sim-entries" aria-labelledby="sim-entries-title">
        <h2 id="sim-entries-title">Participantes inscriptos <span>{entries.length}</span></h2>
        <ul>
          {[...entries].sort((a, b) => a.name.localeCompare(b.name, 'es-AR')).map(entry => <li key={entry.handle}
            className={entry.handle === latestEntry?.handle ? 'sim-new-entry' : undefined}>{entry.name}</li>)}
        </ul>
      </section>}
    </div>
  </div>;
}
