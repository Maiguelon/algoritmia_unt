export interface StatementTranslation {
  title: string;
  body: string[];
  input: string[];
  output: string[];
  samples: [input: string, output: string][];
  sampleNotes?: Record<number, string[]>;
  literals: string[];
  figure?: { afterParagraph: number; crop: [number, number, number, number] };
}

const files = import.meta.glob<StatementTranslation>('../../content/statement-translations/*.json', {
  eager: true, import: 'default',
});

export const statementTranslations = Object.fromEntries(
  Object.entries(files).map(([path, translation]) => [path.split('/').at(-1)!.slice(0, -5), translation]),
);
