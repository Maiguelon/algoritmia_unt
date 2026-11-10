import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import catalog from '../../content/apuntes/cpp/catalogo.json';

export interface Chunk {
  id: string;
  title: string;
  family: string;
  sections: { descripcion: string; operaciones: string; ejemplos: string };
  html: { descripcion: string; operaciones: string; ejemplos: string };
  suggestedPrerequisites: string[];
}
export const sections = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'operaciones', label: 'Funciones y operaciones' },
  { id: 'ejemplos', label: 'Ejemplos' },
] as const;

export const chunks: Chunk[] = catalog.chunks.map((entry) => {
  const source = fs.readFileSync(path.resolve('content/apuntes/cpp', entry.file), 'utf8');
  const title = source.match(/^title: (.+)$/m)?.[1];
  const family = source.match(/^family: (.+)$/m)?.[1];
  if (!title || !family) throw new Error(`Metadatos incompletos: ${entry.id}`);
  const parts = source.split(/^## (?:Descripción|Funciones y operaciones|Ejemplos)\r?\n/m).slice(1);
  if (parts.length !== 3) throw new Error(`Secciones incompletas: ${entry.id}`);
  const texts = { descripcion: parts[0].trim(), operaciones: parts[1].trim(), ejemplos: parts[2].trim() };
  const html = Object.fromEntries(Object.entries(texts).map(([key, value]) => [key, marked.parse(value, { async: false })])) as Chunk['html'];
  return { id: entry.id, title, family, sections: texts, html, suggestedPrerequisites: entry.suggestedPrerequisites };
});
