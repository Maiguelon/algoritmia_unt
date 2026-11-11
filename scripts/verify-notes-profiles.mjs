// Usage: node scripts/verify-notes-profiles.mjs <absolute-output-directory>
import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';

const output=process.argv[2];
if(!output || !path.isAbsolute(output)) throw Error('Indicá una carpeta absoluta para los PDF de revisión.');
await fs.mkdir(output,{recursive:true});
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try {
  const {chunks}=await server.ssrLoadModule('/src/lib/chunks.ts');
  const {problems}=await server.ssrLoadModule('/src/lib/data.ts');
  const {notesLevel,recommendedChunkIds,presetSelection}=await server.ssrLoadModule('/src/lib/notes-presets.ts');
  const {createNotesPdf}=await server.ssrLoadModule('/src/lib/pdf-notes.ts');
  const {includesTemplate,selectedContentChunks}=await server.ssrLoadModule('/src/lib/composition.ts');
  const profiles={'inicial':['tap-2026-a'],'consolidacion':['tap-2026-b'],'salto':['regional-2025-k'],'mixto':['tap-2026-a','regional-2025-k']};
  const cases=Object.fromEntries(Object.entries(profiles).map(([name,ids])=>{
    const chosen=ids.map(id=>problems.find(problem=>problem.id===id));
    return [name,presetSelection('recomendado',recommendedChunkIds(chosen),chunks,notesLevel(chosen))];
  }));
  cases['un-bloque-sin-plantilla']={'cpp-plantilla':{descripcion:false,operaciones:false,ejemplos:false},'cpp-vectores':{descripcion:false,operaciones:true,ejemplos:false}};
  const manifest={};
  for(const [name,selection] of Object.entries(cases)) {
    const bytes=await createNotesPdf(chunks,selection);
    await fs.writeFile(path.join(output,`${name}.pdf`),bytes);
    manifest[name]={selection,template:includesTemplate(selection),chunks:selectedContentChunks(chunks,selection).map(chunk=>({id:chunk.id,title:chunk.title}))};
    console.log(`${name}: ${bytes.length} bytes`);
  }
  await fs.writeFile(path.join(output,'profiles.json'),JSON.stringify(manifest,null,2));
} finally { await server.close(); }
