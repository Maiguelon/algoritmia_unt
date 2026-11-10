// Generate reproducible QA samples without committing generated PDFs.
// Usage: node scripts/verify-pdf.mjs <absolute-output-directory>
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const output = process.argv[2];
if (!output || !path.isAbsolute(output)) throw new Error('Indicá una carpeta absoluta para los PDF de revisión.');
await fs.mkdir(output, { recursive: true });
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { chunks } = await server.ssrLoadModule('/src/lib/chunks.ts');
  const { createNotesPdf } = await server.ssrLoadModule('/src/lib/pdf-notes.ts');
  const operations = { descripcion: false, operaciones: true, ejemplos: false };
  const full = { descripcion: true, operaciones: true, ejemplos: true };
  const selections = {
    'un-bloque': { 'cpp-set': operations },
    'un-bloque-completo': { 'cpp-set': full },
    'solo-plantilla': { 'cpp-plantilla': operations },
    'todos-operaciones': Object.fromEntries(chunks.filter((chunk) => chunk.id !== 'cpp-plantilla').map((chunk) => [chunk.id, operations])),
    'todos-completos': Object.fromEntries(chunks.map((chunk) => [chunk.id, full])),
  };
  for (const [name, selection] of Object.entries(selections)) {
    const bytes = await createNotesPdf(chunks, selection);
    const file = path.join(output, `${name}.pdf`);
    await fs.writeFile(file, bytes);
    console.log(`${name}: ${bytes.length} bytes`);
  }
  const { problems, tournaments } = await server.ssrLoadModule('/src/lib/data.ts');
  const available = problems.filter((problem) => problem.statementUrl).slice(0, 2);
  const statementsImplemented = await fs.access(path.resolve('src/lib/pdf-statements.ts')).then(() => true, () => false);
  if (available.length && statementsImplemented) {
    const { createStatementsPdf } = await server.ssrLoadModule('/src/lib/pdf-statements.ts');
    const loader = async (url) => new Uint8Array(await fs.readFile(path.resolve('public', `.${url}`)));
    for (const count of [1, 2]) {
      if (available.length < count) continue;
      const bytes = await createStatementsPdf(available.slice(0, count), tournaments, loader);
      await fs.writeFile(path.join(output, `enunciados-${count}.pdf`), bytes);
      console.log(`enunciados-${count}: ${bytes.length} bytes`);
    }
  }
} finally {
  await server.close();
}
