import {useEffect,useState} from 'react';
import { readSelected } from '../lib/catalog';
export default function ProblemSelect({id,allowed}:{id:string;allowed:string[]}) {
  const [selected,setSelected]=useState<string[]>([]);
  useEffect(()=>{try{setSelected(readSelected(localStorage.getItem('algoritmia:selected'),allowed));}catch{}},[]);
  const active=selected.includes(id);
  return <button className={active?'button secondary':'button'} onClick={()=>{const next=active?selected.filter(x=>x!==id):[...selected,id];setSelected(next);try{localStorage.setItem('algoritmia:selected',JSON.stringify(next));}catch{}}}>{active?'✓ En tu selección':'＋ Seleccionar problema'}</button>;
}
