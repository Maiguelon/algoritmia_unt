import {useMemo,useState} from 'react';
import type {Problem,Tournament} from '../lib/types';
import {useSelection} from '../lib/selection';
import {tournamentLabel} from '../lib/tournament-label';
export default function StatementDownload({problems,tournaments,includedChunkIds=[]}:{problems:Problem[];tournaments:Tournament[];includedChunkIds?:string[]}){
  const allowed=useMemo(()=>problems.map(problem=>problem.id),[problems]);
  const {selected,remove,clear,ready}=useSelection(allowed);
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const chosen=selected.map(id=>problems.find(p=>p.id===id)!).filter(Boolean);
  const missing=chosen.filter(p=>!p.statementUrl);
  async function download(){setBusy(true);setError('');try{const {downloadStatements}=await import('../lib/pdf-statements');await downloadStatements(chosen,tournaments);}catch(e){setError(e instanceof Error?e.message:'No se pudo generar el PDF.');}finally{setBusy(false);}}
  return <section className="panel material-problems" id="enunciados" aria-label="Problemas seleccionados">
    <div className="material-heading"><h2>Problemas seleccionados <span className="chip">{chosen.length}</span></h2>{chosen.length>0&&<button type="button" className="material-text-button" disabled={busy} onClick={clear}>Vaciar</button>}</div>
    {!ready?<p role="status">Recuperando tus problemas…</p>:chosen.length?<>
      <ol className="material-problem-list">{chosen.map(p=>{
        const tournament=tournaments.find(t=>t.id===p.tournamentId);
        const tools=p.chunkIds.filter(id=>id!=='cpp-plantilla');
        const included=tools.filter(id=>includedChunkIds.includes(id)).length;
        return <li key={p.id}>
          <div className="material-problem-body"><small className="muted">{tournament?tournamentLabel(tournament):''}</small><a className="material-problem-title" href={`/problemas/${p.id}/`}>{p.letter} · {p.title}</a>
            {p.coverage==='fuera de alcance'?<p className="builder-coverage">Top global · Fuera del alcance actual de los apuntes.</p>:<>
              <p className="material-tool-count">{included}/{tools.length} herramientas sugeridas incluidas.</p>
              {p.coverage!=='completa'&&<p className="builder-coverage">Cobertura {p.coverage}.{p.missingTools.length>0&&` Faltan: ${p.missingTools.join(', ')}.`}</p>}
            </>}
            {!p.statementUrl&&<span className="chip">Enunciado descargable pendiente</span>}
          </div>
          <button type="button" className="material-text-button" disabled={busy} aria-label={`Quitar ${p.title}`} onClick={()=>remove(p.id)}>Quitar</button>
        </li>;
      })}</ol>
      <div className="actions"><button type="button" className="button" disabled={busy||missing.length>0} onClick={download}>{busy?'Preparando PDF…':'Descargar PDF de enunciados ↓'}</button><a href="/problemas/">Agregar problemas →</a></div>
      <p className="muted material-pdf-caption">Incluye índice de problemas con enlaces, QR y páginas. Después van los enunciados, sin hojas intermedias.</p>
      {missing.length>0&&<p className="status-pending">Hay {missing.length} enunciados pendientes. Quitalos para descargar los disponibles.</p>}
    </>:<div className="empty"><p>Todavía no seleccionaste problemas.</p><a className="button" href="/problemas/">Explorar problemas ↗</a></div>}
    {error&&<p role="alert">{error}</p>}
    <style>{`
      .material-problems { scroll-margin-top:1.5rem; }
      .material-heading { display:flex; align-items:start; justify-content:space-between; gap:1rem; }
      .material-heading h2 { margin:0; flex:1; min-width:0; }
      .material-heading h2 .chip { vertical-align:middle; margin-left:.5rem; }
      .material-text-button { background:none; border:0; padding:.5rem; font:inherit; font-size:.85rem; color:var(--blue); text-decoration:underline; cursor:pointer; }
      .material-text-button:disabled { opacity:.5; cursor:wait; }
      .material-problem-list { margin:1rem 0; padding:0; list-style:none; counter-reset:material; }
      .material-problem-list li { display:flex; align-items:start; gap:1rem; padding:1.1rem 0; border-bottom:1px solid var(--line); counter-increment:material; }
      .material-problem-list li:before { content:counter(material,decimal-leading-zero); color:var(--blue); background:var(--soft); border-radius:5px; font-weight:800; padding:.2rem .5rem; margin-top:.25rem; }
      .material-problem-body { min-width:0; flex:1; } .material-problem-body small { font-size:.75rem; font-weight:750; }
      .material-problem-title { display:block; font-weight:800; font-size:1.1rem; margin:.1rem 0 .35rem; }
      .material-tool-count,.material-pdf-caption { font-size:.85rem; color:var(--muted); }
      .material-tool-count { margin:.2rem 0; }
      .material-problems .builder-coverage { margin:.3rem 0 0; font-size:.85rem; color:#815716; }
      @media(max-width:480px) { .material-problem-list li { gap:.6rem; } .material-problem-list li:before { font-size:.8rem; } .material-problem-title { font-size:1rem; } }
    `}</style>
  </section>;
}
