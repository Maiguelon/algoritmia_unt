import type { Problem } from '../lib/types';
import { useSelection } from '../lib/selection';

export default function TournamentProblems({ problems, allowed }: { problems: Problem[]; allowed: string[] }) {
  const { selected, ready, toggle } = useSelection(allowed);
  return <div className="table-wrap"><table>
    <thead><tr><th aria-label="Seleccionar"></th><th>Problema</th><th>AC / total</th><th>Nivel editorial</th><th className="desktop-only">Temas</th></tr></thead>
    <tbody>{problems.map(problem => <tr key={problem.id}>
      <td><input type="checkbox" aria-label={`Seleccionar ${problem.title}`} disabled={!ready} checked={selected.includes(problem.id)} onChange={() => toggle(problem.id)}/></td>
      <td><a className="problem-title" href={`/problemas/${problem.id}/`}>{problem.letter} · {problem.title}</a></td>
      <td className="ac">{problem.ac ?? '—'} / {problem.total ?? '—'}</td>
      <td><span className="chip" data-level={problem.difficulty}>{problem.difficulty}</span></td>
      <td className="desktop-only">{problem.topics.join(', ')}</td>
    </tr>)}</tbody>
  </table></div>;
}
