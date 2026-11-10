import {useState} from 'react';
import type {Problem,Tournament} from '../lib/types';
import {useSelection} from '../lib/selection';
import {tournamentLabel} from '../lib/tournament-label';
export default function StatementDownload({problems,tournaments}:{problems:Problem[];tournaments:Tournament[]}){
  const {selected,remove}=useSelection(problems.map(problem=>problem.id));
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const chosen=selected.map(id=>problems.find(p=>p.id===id)!).filter(Boolean);
  const missing=chosen.filter(p=>!p.statementUrl);
  async function download(){setBusy(true);setError('');try{const {downloadStatements}=await import('../lib/pdf-statements');await downloadStatements(chosen,tournaments);}catch(e){setError(e instanceof Error?e.message:'No se pudo generar el PDF.');}finally{setBusy(false);}}
  return <div className="panel"><h2>Tu selección de enunciados</h2>{chosen.length?<><ol>{chosen.map(p=><li key={p.id} style={{padding:'12px 0'}}><a href={`/problemas/${p.id}/`}>{p.letter} · {p.title}</a> <small className="muted">{(() => { const t = tournaments.find(t=>t.id===p.tournamentId); return t ? tournamentLabel(t) : ''; })()}</small> <button className="button secondary small" aria-label={`Quitar ${p.title}`} onClick={()=>remove(p.id)}>Quitar</button>{!p.statementUrl&&<span className="chip">Enunciado descargable pendiente</span>}</li>)}</ol><p className="muted">Incluye índice de problemas con enlaces, QR y páginas. Después van los enunciados, sin hojas intermedias.</p>{missing.length>0&&<p className="status-pending">Hay {missing.length} enunciados pendientes. Quitalos para descargar los disponibles.</p>}<button className="button" disabled={busy||missing.length>0} onClick={download}>{busy?'Preparando PDF…':'Descargar PDF de enunciados ↓'}</button></>:<div className="empty"><p>Todavía no seleccionaste problemas.</p><a className="button" href="/problemas/">Explorar problemas ↗</a></div>}{error&&<p role="alert">{error}</p>}</div>;
}
