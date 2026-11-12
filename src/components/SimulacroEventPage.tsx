import { useEffect, useState } from 'react';
import SimulacroPreview, { type SimulacroProblem } from './SimulacroPreview';
import { simulacroApi, type SimulacroEvent } from '../lib/simulacro-event';
import type { Tournament } from '../lib/types';

type Material = { problems: SimulacroProblem[]; tournaments: Tournament[] };

export default function SimulacroEventPage() {
  const [edition, setEdition] = useState('');
  const [event, setEvent] = useState<SimulacroEvent | null>(null);
  const [receivedAt, setReceivedAt] = useState(0);
  const [material, setMaterial] = useState<Material | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const isReleased = event !== null && event.phase !== 'before';

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('edicion');
    if (id && /^[a-z0-9-]{1,60}$/.test(id)) setEdition(id);
    else setError('Falta indicar la edición del simulacro.');
  }, []);

  useEffect(() => {
    if (!edition) return;
    const controller = new AbortController();
    let timer: number;

    async function refresh() {
      let delay = 5000;
      try {
        const response = await fetch(simulacroApi(edition), {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
        });
        const state = await response.json() as SimulacroEvent & { error?: string };
        if (!response.ok) throw new Error(state.error ?? 'No se pudo cargar el simulacro.');
        if (controller.signal.aborted) return;
        setEvent(state);
        setReceivedAt(Date.now());
        setError('');
        const boundary = state.phase === 'before' ? state.startsAt : state.endsAt;
        if (state.phase !== 'after') delay = Math.min(delay, Math.max(250, boundary - state.serverNow));
      } catch (failure) {
        if (controller.signal.aborted) return;
        setError(failure instanceof Error && failure.name === 'Error' ? failure.message : 'No se pudo actualizar el simulacro.');
      }
      if (!controller.signal.aborted) timer = window.setTimeout(refresh, delay);
    }

    void refresh();
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [edition, reload]);

  useEffect(() => {
    if (!edition || !isReleased) return;
    const controller = new AbortController();
    let timer: number;

    async function loadMaterial() {
      try {
        const response = await fetch(simulacroApi(edition) + '?material=enunciados', {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
        });
        if (!response.ok) throw new Error('No se pudo cargar el material.');
        const content = await response.json() as Material;
        if (!controller.signal.aborted) setMaterial(content);
      } catch {
        if (!controller.signal.aborted) timer = window.setTimeout(loadMaterial, 5000);
      }
    }

    void loadMaterial();
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [edition, isReleased]);

  if (!event) return <p role="status">{error || 'Cargando el simulacro…'}</p>;
  return <>
    {error && <p role="status">Mostrando la última actualización. {error}</p>}
    <SimulacroPreview
      event={event} receivedAt={receivedAt} onRegistered={() => setReload(count => count + 1)}
      problems={material?.problems ?? []} tournaments={material?.tournaments ?? []} chunks={[]} setNotes={{}}
    />
  </>;
}
