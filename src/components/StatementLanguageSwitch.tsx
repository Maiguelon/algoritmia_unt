import { useEffect, useState } from 'react';
import { setPreferSpanishStatements, usePreferSpanishStatements } from '../lib/statement-language';

export default function StatementLanguageSwitch() {
  const enabled = usePreferSpanishStatements();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <button
    type="button"
    className="statement-switch"
    role="switch"
    aria-checked={enabled}
    disabled={!ready}
    aria-label="Preferir enunciados en español"
    title="Descargar enunciados en español cuando estén disponibles"
    onClick={() => setPreferSpanishStatements(!enabled)}
  >
    PDF en ES <span className="statement-switch-track" aria-hidden="true"/>
  </button>;
}
