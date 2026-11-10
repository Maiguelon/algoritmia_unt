import { describe, expect, it, vi } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import type { Problem, Tournament } from '../src/lib/types';
import { createStatementsPdf, uniqueStatementProblems } from '../src/lib/pdf-statements';

import { buildStatementIndex } from '../src/lib/statement-index';

const tournament = { id: 'regional-2025', title: 'Regional South America/South 2025', year: 2025 } as Tournament;
const problem = (id = 'test-H', judgeUrl: string | null = 'https://codeforces.com/gym/123456/problem/H') => ({
  id, tournamentId: tournament.id, letter: 'H', title: 'Problema de prueba',
  judgeUrl, sourceUrl: 'https://example.org/contest.pdf', statementUrl: '/statements/test-H.pdf',
}) as Problem;

async function originalPdf(pages: number): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let index = 0; index < pages; ++index) {
    const page = pdf.addPage([595.28, 841.89]);
    page.drawText(`ORIGINAL SAMPLE ${index + 1}`, { x: 50, y: 780, font });
  }
  return pdf.save();
}

describe('paquetes de enunciados', () => {
  it('rechaza selección vacía, enunciado pendiente y torneo desconocido', async () => {
    await expect(createStatementsPdf([], [])).rejects.toThrow('Seleccioná');
    await expect(createStatementsPdf([{ ...problem(), statementUrl: null }], [tournament])).rejects.toThrow('todavía no está disponible');
    await expect(createStatementsPdf([problem()], [])).rejects.toThrow('torneo');
  });

  it('deduplica problemas conservando el orden elegido', () => {
    const first = problem();
    const second = problem('test-J');
    expect(uniqueStatementProblems([first, second, first]).map((entry) => entry.id)).toEqual([first.id, second.id]);
  });

  it('el QR usa el juez verificado o la fuente sin inventar un juez', () => {
    const withJudge = JSON.stringify(buildStatementIndex([{problem: problem(), tournament, page: 2}]));
    expect(withJudge).toContain('https://codeforces.com/gym/123456/problem/H');
    const withoutJudge = JSON.stringify(buildStatementIndex([{problem: problem('test-J', null), tournament, page: 2}]));
    expect(withoutJudge).toContain('https://example.org/contest.pdf');
    expect(withoutJudge).not.toContain('codeforces');
  });

  it('un solo problema tiene índice y conserva todas sus páginas originales', async () => {
    const source = await originalPdf(2);
    const loader = vi.fn(async () => source);
    const bytes = await createStatementsPdf([problem(), problem()], [tournament], loader);
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(3); // Un índice y dos páginas originales.
    expect(loader).toHaveBeenCalledTimes(1);
    expect(pdf.getPage(2).getSize()).toEqual({ width: 595.28, height: 841.89 });
  }, 20_000);

  it('varios problemas añaden índice y mantienen el orden de los originales', async () => {
    const firstSource = await originalPdf(2);
    const secondSource = await originalPdf(1);
    const first = problem();
    const second = { ...problem('test-J'), statementUrl: '/statements/test-J.pdf' };
    const loader = vi.fn(async (url: string) => url === first.statementUrl ? firstSource : secondSource);
    const pdf = await PDFDocument.load(await createStatementsPdf([first, second], [tournament], loader));
    expect(pdf.getPageCount()).toBe(4); // Un índice y tres páginas originales, sin portadas intermedias.
    expect(loader.mock.calls.map(([url]) => url)).toEqual([first.statementUrl, second.statementUrl]);
  }, 20_000);
});
