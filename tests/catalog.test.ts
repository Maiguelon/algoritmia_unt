import {describe,it,expect} from 'vitest';
import {filterProblems,readSelected,percentage} from '../src/lib/catalog';
import {problems} from '../src/lib/data';
const filters={q:'',tournament:'',difficulty:'',topic:'',sort:'porcentaje'};
describe('catálogo',()=>{
  it('combina criterios y busca sin acentos',()=>{
    const p=problems[0];
    expect(filterProblems(problems,{...filters,q:p.title,tournament:p.tournamentId,difficulty:p.difficulty}).map(p=>p.id)).toContain(p.id);
    expect(filterProblems(problems,{...filters,q:'no existe xyz 29384'})).toEqual([]);
  });
  it('no divide por cero ni interpreta datos ausentes como cero',()=>{expect(percentage({ac:null,total:30})).toBeNull();expect(percentage({ac:0,total:0})).toBeNull();expect(percentage({ac:0,total:30})).toBe(0);});
  it('conserva solo IDs existentes únicos en el orden de selección',()=>{expect(readSelected('["a","a",null,"b","viejo"]',['a','b'])).toEqual(['a','b']);expect(readSelected('{oops',[])).toEqual([]);});
  it('ordena los datos desconocidos al final',()=>{const base=problems[0];const items=[{...base,id:'unknown',ac:null},{...base,id:'known',ac:1,total:20}];expect(filterProblems(items,filters).map(p=>p.id)).toEqual(['known','unknown']);});
});
