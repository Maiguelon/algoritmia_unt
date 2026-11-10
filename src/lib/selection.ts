import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { readSelected } from './catalog';

export const SELECTION_KEY = 'algoritmia:selected';
export const SELECTION_EVENT = 'algoritmia:selection';
let memorySelection = '[]';
let memoryOnly = false;

function snapshot(): string {
  if (memoryOnly) return memorySelection;
  try { return localStorage.getItem(SELECTION_KEY) ?? '[]'; }
  catch { return memorySelection; }
}

function subscribe(notify: () => void): () => void {
  const update = (event: Event) => {
    if (event.type === SELECTION_EVENT || (event as StorageEvent).key === SELECTION_KEY || (event as StorageEvent).key === null) notify();
  };
  window.addEventListener(SELECTION_EVENT, update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener(SELECTION_EVENT, update);
    window.removeEventListener('storage', update);
  };
}

/** Compartido por las islas de React, con avisos en la pestaña actual y las otras. */
export function useSelection(allowed: string[]) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  const selected = useMemo(() => readSelected(raw, allowed), [raw, allowed]);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  function update(change: (current: string[]) => string[]) {
    const next = change(readSelected(snapshot(), allowed));
    memorySelection = JSON.stringify(next);
    try { localStorage.setItem(SELECTION_KEY, memorySelection); } catch { memoryOnly = true; }
    window.dispatchEvent(new Event(SELECTION_EVENT));
  }

  return {
    selected, ready,
    toggle: (id: string) => update(current => current.includes(id) ? current.filter(value => value !== id) : allowed.includes(id) ? [...current, id] : current),
    remove: (id: string) => update(current => current.filter(value => value !== id)),
    clear: () => update(() => []),
  };
}
