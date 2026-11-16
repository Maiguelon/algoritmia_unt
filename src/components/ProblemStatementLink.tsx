import { usePreferSpanishStatements } from '../lib/statement-language';

export default function ProblemStatementLink({ originalUrl, spanishUrl }: { originalUrl: string; spanishUrl: string | null }) {
  const preferSpanish = usePreferSpanishStatements();
  const language = preferSpanish ? (spanishUrl ? ' en español' : ' en inglés') : '';

  return <a href={(preferSpanish && spanishUrl) || originalUrl} download>
    Descargar enunciado{language} ↓
  </a>;
}
