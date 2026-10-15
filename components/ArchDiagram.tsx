import type { Profile } from '@/content/schema';

type Project = Profile['projects'][number];
const W = 128, H = 28, GX = 14, GY = 24;

// capas por rango: cada nodo queda debajo de todos los que lo alimentan
export function ArchDiagram({ project, labels, title, to }: { project: Project; labels: Record<string, string>; title: string; to: string }) {
  const { nodes, edges } = project.architecture;
  const rank: Record<string, number> = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  for (let i = 0; i < nodes.length; i++)
    for (const [a, b] of edges) if ((rank[b] ?? 0) < (rank[a] ?? 0) + 1) rank[b] = (rank[a] ?? 0) + 1;
  const rows: (typeof nodes)[] = [];
  for (const n of nodes) (rows[rank[n.id] ?? 0] ??= []).push(n);
  const maxCols = Math.max(...rows.map((r) => r.length));
  const width = maxCols * W + (maxCols - 1) * GX, height = rows.length * H + (rows.length - 1) * GY;
  const pos: Record<string, { x: number; y: number }> = {};
  rows.forEach((r, ri) => {
    const x0 = (width - (r.length * W + (r.length - 1) * GX)) / 2;
    r.forEach((n, ci) => (pos[n.id] = { x: x0 + ci * (W + GX), y: ri * (H + GY) }));
  });
  const label = `${title}: ${edges.map(([a, b]) => `${labels[a] ?? a} ${to} ${labels[b] ?? b}`).join(', ')}`;
  return (
    <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} width={width + 4} height={height + 4} role="img" aria-label={label}>
      {edges.map(([a, b]) => {
        const A = pos[a], B = pos[b];
        if (!A || !B) return null;
        const x1 = A.x + W / 2, y1 = A.y + H, x2 = B.x + W / 2, y2 = B.y, my = y1 + GY / 2;
        return (
          <g key={`${a}-${b}`}>
            <path className="e" d={x1 === x2 ? `M${x1} ${y1} V${y2 - 5}` : `M${x1} ${y1} V${my} H${x2} V${y2 - 5}`} />
            <path className="ah" d={`M${x2 - 4} ${y2 - 6} L${x2 + 4} ${y2 - 6} L${x2} ${y2} Z`} />
          </g>
        );
      })}
      {nodes.map((n) => {
        const p = pos[n.id];
        if (!p) return null;
        return (
          <g key={n.id}>
            {n.store ? <path className="n" d={`M${p.x + W} ${p.y} H${p.x} V${p.y + H} H${p.x + W}`} /> : <rect className="n" x={p.x} y={p.y} width={W} height={H} />}
            <text x={p.x + W / 2} y={p.y + H / 2 + 4} textAnchor="middle">
              {labels[n.id] ?? n.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
