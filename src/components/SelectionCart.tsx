import { useEffect } from 'react';
import { useSelection } from '../lib/selection';

export default function SelectionCart({ allowed }: { allowed: string[] }) {
  const { selected, clear } = useSelection(allowed);
  useEffect(() => {
    document.documentElement.classList.toggle('has-selection', selected.length > 0);
    return () => document.documentElement.classList.remove('has-selection');
  }, [selected.length]);
  if (!selected.length) return null;
  return <div className="global-cart"><div className="container">
    <section className="selection-bar" aria-label="Selección de problemas">
      <span aria-live="polite"><strong>{selected.length}</strong> {selected.length === 1 ? 'problema seleccionado' : 'problemas seleccionados'}</span>
      <div className="actions">
        <button className="button secondary small" onClick={clear}>Vaciar</button>
        <a className="button secondary" href="/enunciados/">Enunciados ↗</a>
        <a className="button" href="/armar/">Armar apunte ↗</a>
      </div>
    </section>
  </div></div>;
}
