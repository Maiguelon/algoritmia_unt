import type { APIRoute, GetStaticPaths } from 'astro';
import { problems } from '../../../lib/data';
import { baseDefinition, markdownToPdf, renderPdf } from '../../../lib/pdf-engine';
import { statementTranslations } from '../../../lib/statement-translations';

const figures = import.meta.glob<string>('../../../../content/statement-translations/*.png', {
  eager: true, query: '?inline', import: 'default',
});

export const getStaticPaths: GetStaticPaths = () => Object.keys(statementTranslations).map(id => ({ params: { id } }));

export const GET: APIRoute = async ({ params }) => {
  const id = params.id!;
  const translation = statementTranslations[id];
  const problem = problems.find(problem => problem.id === id);
  if (!translation || !problem) throw new Error('Traducción sin problema asociado: ' + id);
  const { title, body, input, output, samples, sampleNotes, figure } = translation;
  const image = figures[`../../../../content/statement-translations/${id}.png`];
  if (figure && !image) throw new Error('Falta la figura de ' + id);

  const definition = baseDefinition(title);
  definition.footer = undefined; // El paquete asigna su propia numeración.
  definition.defaultStyle = { font: 'Roboto', fontSize: 10.5, lineHeight: 1.15, color: '#111111' };
  definition.content = [
    { text: `Problema ${problem.letter} - ${title}`, style: 'documentTitle' },
    { text: 'Traducción al español · Club de Algoritmia UNT', style: 'subtle', margin: [0, 0, 0, 14] },
    ...body.flatMap((paragraph, index) => [
      ...markdownToPdf(paragraph),
      ...(figure?.afterParagraph === index + 1 ? [{ image, width: 210, alignment: 'center', margin: [0, 4, 0, 9] }] : []),
    ]),
    { text: 'Entrada', style: 'sectionTitle' },
    ...input.flatMap(markdownToPdf),
    { text: 'Salida', style: 'sectionTitle' },
    ...output.flatMap(markdownToPdf),
    ...samples.flatMap(([sampleInput, sampleOutput], index) => [
      {
        margin: [0, 8, 0, 0],
        unbreakable: true,
        table: {
          widths: ['*', '*'],
          body: [
            [{ text: `Ejemplo de entrada ${index + 1}`, style: 'tableHeader' }, { text: `Ejemplo de salida ${index + 1}`, style: 'tableHeader' }],
            [{ text: sampleInput, font: 'Mono', preserveLeadingSpaces: true }, { text: sampleOutput, font: 'Mono', preserveLeadingSpaces: true }],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      ...(sampleNotes?.[index + 1] ?? []).flatMap(markdownToPdf),
    ]),
    { text: 'Enunciado original', link: problem.sourceUrl, decoration: 'underline', style: 'subtle', margin: [0, 12, 0, 0] },
  ];
  return new Response(new Uint8Array(await renderPdf(definition)).buffer, { headers: { 'Content-Type': 'application/pdf' } });
};
