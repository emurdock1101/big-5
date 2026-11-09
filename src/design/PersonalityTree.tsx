import React from 'react';
import {TREE_H, TREE_W, edgePath, labelLines, ordinal, rootFontSize, treeLayout} from './tree';

const slice = (x: number, y: number, r: number, i: number, n: number) => {
  const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const a1 = a0 + (2 * Math.PI) / n;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x},${y} L${x + r * Math.cos(a0)},${y + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${
    x + r * Math.cos(a1)
  },${y + r * Math.sin(a1)} Z`;
};

/** Rough width of a name in the root circle, for choosing its font size. */
const approxWidth = (text: string, size: number) => text.length * size * 0.62;

/** The personality tree: you → Stability and Curiosity → five traits → ten aspects. */
const PersonalityTree: React.FC<{percentiles: Record<string, number>; name?: string}> = ({percentiles, name}) => {
  const nodes = treeLayout(percentiles, name);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const described = nodes
    .filter((n) => n.kind !== 'root')
    .map((n) => `${n.lines.join(' ')} ${ordinal(n.value ?? 0)} percentile`)
    .join(', ');

  return (
    <svg
      className='pp-tree'
      viewBox={`0 0 ${TREE_W} ${TREE_H}`}
      role='img'
      aria-label={`Your personality tree. ${described}.`}>
      <g fill='none' stroke='var(--pp-rule)' strokeWidth={2.5} strokeLinejoin='round'>
        {nodes
          .filter((n) => n.parent)
          .map((n) => (
            <polyline key={n.id} points={edgePath(byId[n.parent!], n).map((pt) => pt.join(',')).join(' ')} />
          ))}
      </g>
      {nodes.map((n) => (
        <g key={n.id}>
          {n.colors.length === 1 ? (
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.colors[0]} />
          ) : (
            n.colors.map((c, i) => <path key={c} d={slice(n.x, n.y, n.r, i, n.colors.length)} fill={c} />)
          )}
          {n.kind === 'root' && (
            <>
              <circle cx={n.x} cy={n.y} r={n.r - 16} fill='var(--pp-sheet)' />
              <text
                x={n.x}
                y={n.y + 1}
                textAnchor='middle'
                dominantBaseline='middle'
                className='pp-tree__name'
                fontSize={rootFontSize(n.lines[0], (s) => approxWidth(n.lines[0], s))}>
                {n.lines[0]}
              </text>
            </>
          )}
          {labelLines(n).map((l) => (
            <text
              key={l.text + l.y}
              x={n.x}
              y={l.y}
              textAnchor='middle'
              fontSize={l.size}
              fontWeight={l.weight}
              fill={l.soft ? 'var(--pp-ink-soft)' : 'var(--pp-ink)'}>
              {l.text}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
};

export default PersonalityTree;
