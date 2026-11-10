import type { Problem, Tournament } from './types';
import { tournamentLabel } from './tournament-label';
import { baseDefinition, type PdfDefinition } from './pdf-engine';

export interface StatementIndexEntry { problem: Problem; tournament: Tournament; page: number }

export function buildStatementIndex(entries: StatementIndexEntry[]): PdfDefinition {
  const definition = baseDefinition('Índice de problemas');
  definition.footer = undefined; // El paquete se numera después de reunir todas las páginas.
  definition.content = [
    { text: 'Índice de problemas', style: 'documentTitle', margin: [0, 5, 0, 20] },
    {
      table: {
        headerRows: 1, dontBreakRows: true,
        widths: ['*', 76, 43],
        body: [
          [{ text: 'PROBLEMA', bold: true, fontSize: 8 }, { text: 'QR', bold: true, fontSize: 8 }, { text: 'PÁGINA', bold: true, fontSize: 8, alignment: 'right' }],
          ...entries.map((entry, index) => {
            const url = entry.problem.judgeUrl ?? entry.problem.sourceUrl;
            return [
              { stack: [
                { text: `Problema ${index + 1} - ${entry.problem.title}`, fontSize: 11, bold: true, margin: [0, 0, 0, 7] },
                { text: `${tournamentLabel(entry.tournament)} · ${entry.problem.letter}`, fontSize: 9, color: '#555555', margin: [0, 0, 0, 7] },
                { text: url, link: url, fontSize: 8.5, decoration: 'underline' },
              ] },
              { qr: url, fit: 64, margin: [4, 0, 0, 0] },
              { text: String(entry.page), bold: true, fontSize: 11, alignment: 'right' },
            ];
          }),
        ],
      },
      layout: {
        hLineWidth: () => 0.4, vLineWidth: () => 0,
        hLineColor: () => '#dddddd',
        paddingLeft: () => 0, paddingRight: () => 8,
        paddingTop: (row: number) => row === 0 ? 0 : 16,
        paddingBottom: (row: number) => row === 0 ? 9 : 16,
      },
    },
  ];
  return definition;
}
