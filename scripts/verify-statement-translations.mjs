import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const pathFromRoot = path => fileURLToPath(new URL(path, root));
const readJson = path => JSON.parse(readFileSync(pathFromRoot(path), 'utf8'));
const translationDir = 'content/statement-translations/';
const canonical = value => value.normalize('NFC').replace(/[\s`]/gu, '');
const sourceText = value => canonical(value.normalize('NFKC'));
const readPdf = file => execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', file, '-'], { encoding: 'utf8' });

function samplePairs(text, language, id) {
  const [input, output] = language === 'es'
    ? ['Ejemplo de entrada', 'Ejemplo de salida']
    : ['Sample input', 'Sample output'];
  const heading = new RegExp(`^( *)(?:${input}) (\\d+) +(${output}) \\2\\s*$`);
  const lines = text.replaceAll('\r', '').split(/[\n\f]/);
  const notes = language === 'es' ? 'Explicación del ejemplo' : 'Explanation of sample';
  const pairs = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (!line.trimStart().startsWith(input)) continue;
    const match = heading.exec(line);
    assert.ok(match, `${id}: formato de ejemplo no reconocido: ${line.trim()}`);
    assert.equal(Number(match[2]), pairs.length + 1, `${id}: orden de los ejemplos`);
    const split = line.indexOf(output);
    const row = lines.slice(index + 1).find(next => next.trim());
    assert.ok(row && row.length > split, `${id}: falta el ejemplo ${match[2]}`);
    const inputLines = [];
    const outputLines = [];
    let sampleIndex = lines.indexOf(row, index + 1);
    while (sampleIndex < lines.length && lines[sampleIndex].trim()
      && !lines[sampleIndex].trimStart().startsWith(input)
      && !lines[sampleIndex].trimStart().startsWith(notes)) {
      const data = lines[sampleIndex];
      inputLines.push(data.slice(match[1].length, split).trimEnd());
      outputLines.push(data.slice(split).trimEnd());
      sampleIndex++;
    }
    pairs.push([inputLines.join('\n').trimEnd(), outputLines.join('\n').trimEnd()]);
    index = sampleIndex - 1;
  }
  assert.ok(pairs.length, `${id}: no se encontraron ejemplos`);
  return pairs;
}

for (const file of readdirSync(pathFromRoot(translationDir)).filter(file => file.endsWith('.json'))) {
  const id = file.slice(0, -5);
  const problem = readJson(`content/problems/${id}.json`);
  const translation = readJson(translationDir + file);
  const originalPdf = pathFromRoot('public' + problem.statementUrl);
  const original = readPdf(originalPdf);
  assert.equal(translation.title, problem.title, `${id}: título`);
  for (const section of ['body', 'input', 'output', 'literals']) {
    assert.ok(translation[section]?.length && translation[section].every(line => typeof line === 'string' && line.trim()),
      `${id}: sección vacía o inválida (${section})`);
  }
  const originalNotes = [...original.matchAll(/Explanation of sample (\d+)\s*:/g)].map(match => Number(match[1]));
  const translatedNotes = Object.entries(translation.sampleNotes ?? {});
  assert.deepEqual(translatedNotes.map(([index]) => Number(index)), originalNotes, `${id}: faltan explicaciones de ejemplos o sobran`);
  for (const [index, paragraphs] of translatedNotes) {
    assert.ok(paragraphs.length && paragraphs.every(paragraph => paragraph.trim()), `${id}: explicación vacía del ejemplo ${index}`);
  }
  const translatedProse = canonical([
    ...translation.body, ...translation.input, ...translation.output, ...translatedNotes.flatMap(([, paragraphs]) => paragraphs),
  ].join('\n'));
  const originalProse = sourceText(original);
  for (const literal of translation.literals) {
    const sourceLiteral = sourceText(literal);
    // Poppler escribe los índices tipográficos sin el separador «_».
    const flattened = sourceLiteral.replace(/(?<=[A-Za-z])_(?=[0-9A-Za-z])/g, '');
    assert.ok(originalProse.includes(sourceLiteral) || originalProse.includes(flattened),
      `${id}: literal no localizado en el original: ${literal}`);
    assert.ok(translatedProse.includes(canonical(literal)), `${id}: literal perdido en español: ${literal}`);
  }
  const originals = samplePairs(original, 'en', id);
  assert.deepEqual(translation.samples, originals, `${id}: los ejemplos difieren del original`);
  const figurePath = pathFromRoot(translationDir + id + '.png');
  if (translation.figure) {
    const { afterParagraph, crop } = translation.figure;
    assert.ok(Number.isInteger(afterParagraph) && afterParagraph >= 1 && afterParagraph <= translation.body.length, `${id}: ubicación de la figura`);
    const [x, y, width, height] = crop.map(String);
    const figure = execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-r', '144', '-png', '-x', x, '-y', y, '-W', width, '-H', height, originalPdf]);
    assert.deepEqual(readFileSync(figurePath), figure, `${id}: el recorte difiere del PDF original`);
  } else {
    assert.ok(!existsSync(figurePath), `${id}: hay una figura que no se usa`);
  }

  const rendered = pathFromRoot(`dist/statements/es/${id}.pdf`);
  if (process.argv.includes('--pdf')) {
    const pdf = readPdf(rendered);
    assert.ok(/^\s*Entrada\s*$/m.test(pdf) && /^\s*Salida\s*$/m.test(pdf), `${id}: faltan secciones en el PDF`);
    assert.deepEqual(samplePairs(pdf, 'es', id), originals, `${id}: los ejemplos cambiaron en el PDF`);
    const pdfNotes = [...pdf.matchAll(/^\s*Explicación del ejemplo (\d+)\s*$/gm)].map(match => Number(match[1]));
    assert.deepEqual(pdfNotes, originalNotes, `${id}: faltan explicaciones de ejemplos en el PDF`);
    for (const literal of translation.literals) {
      assert.ok(canonical(pdf).includes(canonical(literal)), `${id}: literal ilegible o perdido en el PDF: ${literal}`);
    }
  }
  console.log(`${id}: ${originals.length} ejemplos verificados`);
}
