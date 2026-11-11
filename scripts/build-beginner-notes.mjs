// Fixed handout for /empeza/. Regenerate when these tool blocks change.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';

const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try {
  const {chunks}=await server.ssrLoadModule('/src/lib/chunks.ts');
  const {buildNotesDefinition}=await server.ssrLoadModule('/src/lib/pdf-notes.ts');
  const {renderPdf}=await server.ssrLoadModule('/src/lib/pdf-engine.ts');
  const ids=['cpp-plantilla','cpp-variables','cpp-entrada-salida','cpp-condiciones','cpp-cuentas-enteras'];
  for(const id of ids) if(!chunks.some(chunk=>chunk.id===id)) throw Error(`Falta el bloque ${id}.`);
  const selection=Object.fromEntries(ids.map(id=>[id,{descripcion:true,operaciones:true,ejemplos:true}]));
  const definition=buildNotesDefinition(chunks,selection);
  definition.info={title:'Apunte para tu primer problema - Algoritmia UNT',author:'Club de Algoritmia - UNT'};
  definition.content[0].text='Apunte para tu primer problema';
  definition.content[1].text='A. A la mitad - TAP 2026 - GNU C++17';
  const output=path.resolve('public/downloads/apunte-primer-problema.pdf');
  await fs.mkdir(path.dirname(output),{recursive:true});
  const bytes=await renderPdf(definition);
  await fs.writeFile(output,bytes);
  console.log(`Apunte fijo: ${output} (${bytes.length} bytes).`);
} finally { await server.close(); }
