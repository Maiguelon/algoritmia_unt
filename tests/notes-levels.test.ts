import {describe,it,expect} from 'vitest';
import {chunks} from '../src/lib/chunks';
import type {Problem} from '../src/lib/types';
import {BASIC_CHUNK_IDS,notesLevel,recommendedChunkIds,presetSelection} from '../src/lib/notes-presets';
import {includesTemplate} from '../src/lib/composition';

const initial:Pick<Problem,'difficulty'|'coverage'|'chunkIds'>={difficulty:'Inicial',coverage:'completa',chunkIds:['cpp-set']};
const consolidated:typeof initial={difficulty:'Consolidación',coverage:'completa',chunkIds:['cpp-recorridos','cpp-cuentas-enteras','cpp-strings','cpp-set']};
const regional:typeof initial={difficulty:'Salto regional',coverage:'parcial',chunkIds:['cpp-vectores','cpp-prefijos','cpp-cuentas-enteras']};
const advanced:typeof initial={difficulty:'Avanzado',coverage:'parcial',chunkIds:['cpp-map']};
const all={descripcion:true,operaciones:true,ejemplos:true};
const functions={descripcion:false,operaciones:true,ejemplos:false};
const recommended=(problems:typeof initial[])=>presetSelection('recomendado',recommendedChunkIds(problems),chunks,notesLevel(problems));

describe('recomendaciones por el nivel mínimo de la selección',()=>{
  it('Inicial agrega la base y explica las herramientas con sus ejemplos',()=>{
    const selection=recommended([initial]);
    for(const id of BASIC_CHUNK_IDS)expect(selection[id]).toEqual(all);
    expect(selection['cpp-set']).toEqual(all);
    expect(selection['cpp-plantilla']).toEqual(all);
    expect(includesTemplate(selection)).toBe(true);
  });
  it('Consolidación conserva el código de plantilla y omite la base incluso si figura en la ficha',()=>{
    const selection=recommended([consolidated]);
    for(const id of BASIC_CHUNK_IDS)expect(selection).not.toHaveProperty(id);
    expect(selection['cpp-set']).toEqual(all);
    expect(selection['cpp-strings']).toEqual(all);
    expect(selection['cpp-plantilla']).toEqual({descripcion:false,operaciones:false,ejemplos:true});
  });
  it('Salto regional separa referencia de contenedores y explicación de técnicas',()=>{
    const selection=recommended([regional]);
    expect(includesTemplate(selection)).toBe(false);
    expect(selection['cpp-vectores']).toEqual(functions);
    expect(selection['cpp-prefijos']).toEqual(all);
    for(const id of BASIC_CHUNK_IDS)expect(selection).not.toHaveProperty(id);
    const complete=presetSelection('completo',recommendedChunkIds([regional]),chunks,'Salto regional');
    expect(complete['cpp-vectores']).toEqual(all);
    expect(includesTemplate(complete)).toBe(false);
  });
  it('usa la banda más accesible de la mezcla, independientemente del orden',()=>{
    expect(recommended([regional,initial])).toEqual(recommended([initial,regional]));
    expect(recommended([initial,regional])['cpp-vectores']).toEqual(all);
    expect(includesTemplate(recommended([regional,consolidated]))).toBe(true);
    expect(recommended([regional,consolidated])['cpp-vectores']).toEqual(all);
  });
  it('no agrega recomendaciones avanzadas ni permite que cambien el perfil de los otros problemas',()=>{
    expect(notesLevel([advanced])).toBeNull();
    expect(recommendedChunkIds([advanced])).toEqual([]);
    expect(includesTemplate(recommended([advanced]))).toBe(false);
    expect(recommended([advanced,regional])).toEqual(recommended([regional]));
    expect(recommended([{...initial,coverage:'fuera de alcance'}])).toEqual(recommended([advanced]));
  });
  it('puede dejar solo la plantilla para un Consolidación que usa únicamente herramientas básicas',()=>{
    const selection=recommended([{...consolidated,chunkIds:['cpp-cuentas-enteras']}]);
    expect(Object.keys(selection)).toEqual(['cpp-plantilla']);
    expect(includesTemplate(selection)).toBe(true);
  });
});
