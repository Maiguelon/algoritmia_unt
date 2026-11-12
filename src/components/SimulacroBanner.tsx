import { useEffect, useState } from 'react';
import { simulacroApi, type SimulacroAnnouncement } from '../lib/simulacro-event';
import schedule from '../../content/simulacros/miercoles-2026-11-18.json';
import '../styles/simulacro-banner.css';

const dayFormat = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Tucuman', weekday: 'long', day: 'numeric',
});
const timeFormat = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Tucuman', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
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
  const startsAt = new Date(event?.startsAt ?? schedule.startsAt);
  const endsAt = new Date(event?.endsAt ?? schedule.endsAt);
  const date = dayFormat.format(startsAt);
  const start = timeFormat.format(startsAt).replace(/:00$/, '');
  const end = timeFormat.format(endsAt).replace(/:00$/, '');
  const url = event ? '/simulacro/torneo/?edicion=' + encodeURIComponent(event.id) : '/simulacro/';
  return <aside className="sim-home-banner" aria-label="Simulacro del club" data-live={active}>
    <div className="container sim-home-banner-inner">
      <div className="sim-home-banner-info">
        <span className="sim-home-banner-label">{active ? 'En vivo' : 'Próximo torneo'}</span>
        <div className="sim-home-banner-details">
          <strong>{event?.title ?? schedule.title}</strong>
          <span className="sim-home-banner-meta"><span>{date} de {start} a {end} hs</span><span>En {schedule.venue} o en remoto</span></span>
        </div>
      </div>
      <a className="button small" href={url}>{active ? 'Entrar al torneo' : 'Ver torneo'} <span aria-hidden="true">→</span></a>
    </div>
  </aside>;
}
