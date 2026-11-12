import type { APIRoute } from 'astro';
import { baseDefinition, renderPdf } from '../../lib/pdf-engine';

const sourceUrl = 'https://codeforces.com/problemset/problem/4/A';

export const GET: APIRoute = async () => {
  const definition = baseDefinition('4A · Sandía');
  definition.defaultStyle = { font: 'Roboto', fontSize: 11, lineHeight: 1.25, color: '#23263b' };
  definition.content = [
    { text: '4A · Sandía', style: 'documentTitle' },
    { text: 'Watermelon · Codeforces', style: 'subtle', margin: [0, 0, 0, 8] },
    { text: 'Tiempo límite 1 s · Memoria 64 MB', style: 'subtle', margin: [0, 0, 0, 19] },
    { text: 'Una sandía pesa w kilogramos. Determiná si se puede repartir en dos porciones de peso positivo, de modo que ambas pesen un número par de kilogramos. Las porciones pueden pesar distinto.' },
    { text: 'Entrada', style: 'sectionTitle' },
    { text: 'Un único entero w, entre 1 y 100 inclusive, que indica el peso de la sandía en kilogramos.' },
    { text: 'Salida', style: 'sectionTitle' },
    { text: [{ text: 'Imprimí ' }, { text: 'YES', bold: true }, { text: ' si el reparto es posible. Si no, imprimí ' }, { text: 'NO', bold: true }, { text: '.' }] },
    { text: 'Ejemplo', style: 'sectionTitle' },
    { table: {
      widths: ['*', '*'],
      body: [
        [{ text: 'Entrada', style: 'tableHeader' }, { text: 'Salida', style: 'tableHeader' }],
        [{ text: '8', font: 'Mono' }, { text: 'YES', font: 'Mono' }],
      ],
    }, layout: 'lightHorizontalLines' },
    { text: 'Adaptación al español del enunciado de Codeforces', link: sourceUrl, decoration: 'underline', style: 'subtle', margin: [0, 23, 0, 0] },
  ];

  const bytes = await renderPdf(definition);
  return new Response(new Uint8Array(bytes).buffer, { headers: { 'Content-Type': 'application/pdf' } });
};
