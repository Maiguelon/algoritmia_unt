import { useMemo, useState } from 'react';
import type { Chunk } from '../lib/chunks';

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
}

export default function NotesLibrary({ chunks }: { chunks: Chunk[] }) {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('');
  const families = [...new Set(chunks.map((chunk) => chunk.family))];
  const filtered = useMemo(() => chunks.filter((chunk) => (
    (!family || chunk.family === family)
    && normalize(`${chunk.title} ${chunk.family} ${chunk.sections.descripcion}`).includes(normalize(query.trim()))
  )), [chunks, family, query]);

  return <div className="notes-library">
    <div className="panel notes-search">
      <label htmlFor="notes-query">Buscar una herramienta</label>
      <input id="notes-query" type="search" placeholder="Por ejemplo: set, recorridos o stoll" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="notes-families" aria-label="Filtrar apuntes por grupo">
        <button type="button" className={`chip ${family === '' ? 'active' : ''}`} aria-pressed={family === ''} onClick={() => setFamily('')}>Todos</button>
        {families.map((name) => <button type="button" key={name} className={`chip ${family === name ? 'active' : ''}`} aria-pressed={family === name} onClick={() => setFamily(name)}>{name}</button>)}
      </div>
      <p className="muted" role="status">{filtered.length} de {chunks.length} bloques</p>
    </div>

    {filtered.length === 0 && <div className="panel"><h2>No encontramos bloques con esos filtros</h2><p>Probá otra palabra o volvé a mostrar todos los grupos.</p><button type="button" className="button secondary" onClick={() => { setQuery(''); setFamily(''); }}>Limpiar filtros</button></div>}

    {families.filter((name) => filtered.some((chunk) => chunk.family === name)).map((name) => <section key={name} className="notes-family-section" aria-label={name}>
      <div className="notes-family-heading"><h2>{name}</h2><span className="muted">{filtered.filter((chunk) => chunk.family === name).length} {filtered.filter((chunk) => chunk.family === name).length === 1 ? 'bloque' : 'bloques'}</span></div>
      <div className="notes-card-grid">
        {filtered.filter((chunk) => chunk.family === name).map((chunk) => <article className="panel notes-card" key={chunk.id}>
          <p className="eyebrow">C++17{chunk.id === 'cpp-plantilla' ? ' · Al principio de cada apunte' : ''}</p>
          <h3><a href={`/apuntes/${chunk.id}/`}>{chunk.title}</a></h3>
          <p className="muted">{chunk.sections.descripcion.split(/\n\s*\n/)[0].replace(/`/g, '')}</p>
          <div className="notes-card-actions"><a href={`/apuntes/${chunk.id}/`}>Leer ficha →</a>{chunk.id !== 'cpp-plantilla' && <a href={`/seleccion/?chunk=${encodeURIComponent(chunk.id)}`}>Usar en apunte</a>}</div>
        </article>)}
      </div>
    </section>)}
    <style>{`
      .notes-search { display:grid; gap: .85rem; margin-bottom: 2.25rem; }
      .notes-search label { font-weight: 700; }
      .notes-search input { width:100%; box-sizing:border-box; padding:.85rem 1rem; border:1px solid var(--border, #d4ded9); border-radius:.6rem; background:var(--surface, #fff); color:inherit; font:inherit; }
      .notes-families { display:flex; flex-wrap:wrap; gap:.5rem; }
      .notes-families .chip { border:1px solid var(--line, #d4ded9); padding:.4rem .65rem; min-height:2.25rem; }
      .notes-families .active { background:var(--accent, #135745); color:white; border-color:var(--accent, #135745); }
      .notes-search .muted { margin:0; }
      .notes-family-section { margin-block:2rem; }
      .notes-family-heading { display:flex; align-items:baseline; justify-content:space-between; gap:1rem; }
      .notes-card-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 285px), 1fr)); gap:1rem; }
      .notes-card { display:flex; flex-direction:column; }
      .notes-card h3 { margin:.2rem 0 .6rem; }
      .notes-card h3 a { color:inherit; text-decoration:none; }
      .notes-card h3 a:hover { text-decoration:underline; }
      .notes-card .muted { flex:1; line-height:1.65; }
      .notes-card-actions { display:flex; flex-wrap:wrap; gap:.75rem 1rem; margin-top:.5rem; font-size:.9rem; font-weight:650; }
    `}</style>
  </div>;
}
