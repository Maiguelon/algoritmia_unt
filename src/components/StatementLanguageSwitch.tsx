import { setPreferSpanishStatements, usePreferSpanishStatements } from '../lib/statement-language';

export default function StatementLanguageSwitch() {
  const enabled = usePreferSpanishStatements();
  return <button
    type="button"
    className="statement-switch"
    role="switch"
    aria-checked={enabled}
    aria-label="Preferir enunciados en español"
    title="Descargar enunciados en español cuando estén disponibles"
    onClick={() => setPreferSpanishStatements(!enabled)}
  >
    PDF en ES <span className="statement-switch-track" aria-hidden="true"/>
  </button>;
}
