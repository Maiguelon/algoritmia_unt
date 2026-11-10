import { useEffect, useRef, useState } from 'react';
import { useSelection } from '../lib/selection';

export default function SelectionCart({ allowed }: { allowed: string[] }) {
  const { selected, clear } = useSelection(allowed);
  const [busy, setBusy] = useState<'enunciados' | 'apunte' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle('has-selection', selected.length > 0);
    return () => document.documentElement.classList.remove('has-selection');
  }, [selected.length]);
  useEffect(() => { setMessage(''); setError(''); }, [selected]);
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector('summary')?.focus();
      }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, []);
  async function download(kind: 'enunciados' | 'apunte') {
    if (busy) return;
    if (menu.current) menu.current.open = false;
    setBusy(kind); setMessage(''); setError('');
    try {
      const { downloadMaterial } = await import('../lib/material-download');
      await downloadMaterial(kind, selected);
      setMessage(kind === 'apunte' ? 'Apunte recomendado descargado. Revisá la cobertura en tu selección.' : 'Enunciados descargados.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo preparar la descarga. Probá de nuevo.');
    } finally { setBusy(null); }
  }
  if (!selected.length) return null;
  return <div className="global-cart"><div className="container">
    <section className="selection-bar" aria-label="Selección de problemas">
      <span aria-live="polite"><strong>{selected.length}</strong> {selected.length === 1 ? 'problema seleccionado' : 'problemas seleccionados'}</span>
      <div className="actions">
        <a className="button cart-view" href="/seleccion/">Ver selección →</a>
        <button className="button secondary cart-desktop-download" disabled={Boolean(busy)} onClick={() => download('enunciados')}>{busy === 'enunciados' ? 'Preparando…' : 'Descargar enunciados'}</button>
        <button className="button secondary cart-desktop-download" disabled={Boolean(busy)} onClick={() => download('apunte')}>{busy === 'apunte' ? 'Preparando…' : 'Apunte recomendado'}</button>
        <details className="cart-download-menu" ref={menu}>
          <summary>{busy ? 'Preparando…' : 'Descargar ↓'}</summary>
          <div className="cart-download-options">
            <button disabled={Boolean(busy)} onClick={() => download('enunciados')}>Enunciados PDF</button>
            <button disabled={Boolean(busy)} onClick={() => download('apunte')}>Apunte recomendado PDF</button>
          </div>
        </details>
        <button className="cart-clear" disabled={Boolean(busy)} onClick={clear}>Vaciar</button>
      </div>
      {busy && <span className="cart-feedback" role="status">Preparando {busy === 'apunte' ? 'el apunte recomendado' : 'los enunciados'}…</span>}
      {message && <span className="cart-feedback" role="status">{message}</span>}
      {error && <span className="cart-feedback" role="alert">{error} <a href="/seleccion/">Ver selección →</a></span>}
    </section>
  </div></div>;
}
