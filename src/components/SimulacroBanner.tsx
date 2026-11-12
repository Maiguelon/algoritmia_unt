import { useEffect, useState } from 'react';
import { simulacroApi, type SimulacroAnnouncement } from '../lib/simulacro-event';
import '../styles/simulacro-banner.css';

const dayFormat = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Tucuman', weekday: 'long', day: 'numeric', month: 'long',
});
const timeFormat = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Tucuman', hour: '2-digit', minute: '2-digit',
});

export default function SimulacroBanner({ preview }: { preview: boolean }) {
  const [event, setEvent] = useState<SimulacroAnnouncement | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let timer: number;

    async function refresh() {
      let delay = 60000;
      try {
        const response = await fetch(simulacroApi('proximo'), {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]),
        });
        if (response.ok && !controller.signal.aborted) {
          const next = await response.json() as SimulacroAnnouncement | null;
          if (controller.signal.aborted) return;
          setEvent(next);
          if (next) {
            const boundary = next.phase === 'live' ? next.endsAt : next.startsAt;
            delay = Math.min(delay, Math.max(500, boundary - next.serverNow));
          }
        }
      } catch {
        // The home remains usable if the event service is briefly unavailable.
      }
      if (!controller.signal.aborted) timer = window.setTimeout(refresh, delay);
    }

    if (!preview) void refresh();
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [preview]);

  if (!event && !preview) return null;
  const active = event?.phase === 'live';
  const date = event ? dayFormat.format(event.startsAt) : 'Miércoles 18 de noviembre';
  const hours = event ? timeFormat.format(event.startsAt) + '–' + timeFormat.format(event.endsAt) : '2 horas';
  const url = event ? '/simulacro/torneo/?edicion=' + encodeURIComponent(event.id) : '/simulacro/';
  return <aside className="sim-home-banner" aria-label="Simulacro del club" data-live={active}>
    <div className="container sim-home-banner-inner">
      <div className="sim-home-banner-info">
        <strong>{event?.title ?? 'Simulacro del club'}</strong>
        <span className="sim-home-banner-meta"><span>{date} · {hours}</span><span>En la FACET o desde casa</span></span>
      </div>
      <a className="button small" href={url}>{active ? 'Entrar al simulacro' : preview ? 'Ver simulacro' : 'Anotarme'} <span aria-hidden="true">→</span></a>
    </div>
  </aside>;
}
