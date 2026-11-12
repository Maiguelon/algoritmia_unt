import { useEffect, useState, type SubmitEvent } from 'react';
import { findCodeforcesHandle, recentCodeforcesSubmissions, type CodeforcesSubmission } from '../lib/codeforces';

const problem = { contestId: 4, index: 'A' };
const pollInterval = 7000;

export default function SimulacroPractice() {
  const [input, setInput] = useState('');
  const [handle, setHandle] = useState('');
  const [checking, setChecking] = useState(false);
  const [handleError, setHandleError] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [submission, setSubmission] = useState<CodeforcesSubmission | null>(null);
  const [syncError, setSyncError] = useState(false);
  const accepted = submission?.verdict === 'OK';
  const pending = submission && (!submission.verdict || ['TESTING', 'SUBMITTED'].includes(submission.verdict));

  useEffect(() => {
    const savedHandle = new URLSearchParams(window.location.search).get('usuario');
    if (savedHandle && /^[a-z0-9_.-]{1,48}$/i.test(savedHandle)) setInput(savedHandle);
  }, []);

  useEffect(() => {
    if (startedAt === null || !handle || accepted) return;
    const since = startedAt;
    const controller = new AbortController();
    let timer: number;
    let checkingSubmissions = false;
    let lastCheckAt = Date.now();

    async function check() {
      window.clearTimeout(timer);
      if (document.hidden || checkingSubmissions || controller.signal.aborted) return;
      const wait = 3000 - (Date.now() - lastCheckAt);
      if (wait > 0) {
        timer = window.setTimeout(check, wait);
        return;
      }

      checkingSubmissions = true;
      lastCheckAt = Date.now();
      try {
        const recent = await recentCodeforcesSubmissions(handle, controller.signal);
        const matches = recent.filter(item => item.creationTimeSeconds >= since
          && item.problem.contestId === problem.contestId && item.problem.index === problem.index);
        if (controller.signal.aborted) return;
        setSubmission(matches.find(item => item.verdict === 'OK') ?? matches[0] ?? null);
        setSyncError(false);
      } catch {
        if (!controller.signal.aborted) setSyncError(true);
      } finally {
        checkingSubmissions = false;
        if (!controller.signal.aborted && !document.hidden) timer = window.setTimeout(check, pollInterval);
      }
    }

    // Dejá pasar el límite entre consultas si el usuario recién confirmó su cuenta.
    timer = window.setTimeout(check, 3000);
    document.addEventListener('visibilitychange', check);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, [startedAt, handle, accepted]);

  async function validateHandle(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking) return;
    const requested = input.trim();
    setHandleError('');
    if (!/^[a-z0-9_.-]{1,48}$/i.test(requested)) {
      setHandleError('Escribí tu usuario de Codeforces sin espacios.');
      return;
    }
    setChecking(true);
    try {
      const current = await findCodeforcesHandle(requested);
      if (current) setHandle(current);
      else setHandleError('No encontramos ese usuario. Revisá cómo está escrito.');
    } catch {
      setHandleError('No pudimos consultar Codeforces. Volvé a intentar.');
    } finally {
      setChecking(false);
    }
  }

  return <div className="sim-practice-side">
    <section className="sim-panel sim-material" aria-labelledby="sim-practice-send">
      <h2 id="sim-practice-send">Envialo a Codeforces</h2>
      {!handle ? <form className="sim-practice-form" onSubmit={validateHandle}>
        <label htmlFor="practice-handle">Usuario de Codeforces</label>
        <input id="practice-handle" value={input} onChange={event => setInput(event.target.value)}
          maxLength={48} spellCheck={false} autoCapitalize="none" readOnly={checking} required/>
        <button className="button secondary small" type="submit" disabled={checking}>{checking ? 'Verificando…' : 'Confirmar usuario'}</button>
      </form> : <p>Vas a enviar con <strong>{handle}</strong>.</p>}
      {handleError && <p className="sim-error" role="alert">{handleError}</p>}
      <ol className="sim-how">
        <li>En el campo del problema, escribí <strong>4A</strong>.</li>
        <li>Elegí GNU C++17 o posterior, pegá el código y apretá <strong>Submit</strong>.</li>
        <li>Volvé a esta pestaña para ver el resultado.</li>
      </ol>
      <div className="actions">
        {handle && <a className="button" href="https://codeforces.com/problemset/submit" target="_blank" rel="noreferrer"
          onClick={() => setStartedAt(current => current ?? Math.floor(Date.now() / 1000))}>Enviar en Codeforces ↗</a>}
      </div>
    </section>
    <section className="sim-panel sim-ranking sim-practice-board" data-phase="live" aria-labelledby="sim-practice-board-title">
      <div className="sim-ranking-header">
        <h2 id="sim-practice-board-title">Tu marcador de práctica</h2>
      </div>
      <table>
        <thead><tr><th scope="col">Usuario</th><th scope="col" data-problem="A">4A</th><th scope="col">AC</th></tr></thead>
        <tbody><tr>
          <th scope="row" className="sim-team">{handle || 'Tu usuario'}</th>
          <td data-problem="A" aria-label={accepted ? 'Problema aceptado' : 'Sin AC'}>
            {accepted ? <span className="sim-balloon" data-new="true" aria-hidden="true"/> : '–'}
          </td>
          <td className="sim-total">{accepted ? 1 : 0}</td>
        </tr></tbody>
      </table>
      <p className="sim-practice-status" role="status">
        {accepted ? <><strong>¡Accepted!</strong> Tu envío ya sumó un AC y un globo.</>
          : syncError ? 'Codeforces tardó en responder. Vamos a volver a consultar.'
          : pending ? 'Envío recibido. Codeforces lo está evaluando.'
          : submission ? `Codeforces respondió ${submission.verdict?.replaceAll('_', ' ')}. Podés volver a enviar.`
          : startedAt !== null ? 'Buscando un envío nuevo para 4A…'
          : 'Acá vas a ver el veredicto de tu envío.'}
      </p>
    </section>
  </div>;
}
