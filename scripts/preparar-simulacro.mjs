import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const schedule = JSON.parse(await readFile(new URL('../content/simulacros/miercoles-2026-11-18.json', import.meta.url), 'utf8'));
const [edition, first, second, third] = process.argv.slice(2);
const [starts, ends, output] = edition === schedule.id && !second && !third
  ? [schedule.startsAt, schedule.endsAt, first]
  : [first, second, third];
const isoWithZone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/;
const start = Date.parse(starts);
const end = Date.parse(ends);
if (!edition || edition === 'proximo' || !/^[a-z0-9-]{1,60}$/.test(edition) || !output
    || !isoWithZone.test(starts) || !isoWithZone.test(ends) || !(end > start)) {
  throw new Error('Uso: node scripts/preparar-simulacro.mjs ID INICIO_ISO FIN_ISO ARCHIVO_SQL');
}

const rehearsal = edition.startsWith('ensayo');
const ids = rehearsal
  ? ['tap-2026-a', 'tap-2026-b', 'regional-2025-e']
  : ['tap-2024-d', 'tap-2024-g', 'tap-2025-i', 'tap-2024-n', 'regional-2023-b'];
for (const id of ids) {
  const problem = JSON.parse(await readFile(new URL('../content/problems/' + id + '.json', import.meta.url), 'utf8'));
  if (!problem.statementUrl || !/^https:\/\/codeforces\.com\/gym\/\d+\/problem\/[A-Z][A-Z0-9]*$/.test(problem.judgeUrl ?? '')) {
    throw new Error('Falta el enunciado o el Gym de ' + id);
  }
}
const title = rehearsal ? 'Ensayo de inscripción' : schedule.title;
const quote = value => "'" + value.replaceAll("'", "''") + "'";
const sql = `INSERT INTO simulacros (id, title, starts_at, ends_at, problem_ids) VALUES (${quote(edition)}, ${quote(title)}, ${start}, ${end}, ${quote(JSON.stringify(ids))});\n`;
await mkdir(dirname(output), { recursive: true });
await writeFile(output, sql);
