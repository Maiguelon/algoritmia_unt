import { useSelection } from '../lib/selection';
export default function ProblemSelect({id,allowed}:{id:string;allowed:string[]}) {
  const {selected,ready,toggle}=useSelection(allowed);
  const active=selected.includes(id);
  return <button disabled={!ready} className={active?'button secondary':'button'} onClick={()=>toggle(id)}>{active?'✓ En tu selección':'＋ Seleccionar problema'}</button>;
}
