import React from 'react';
import {TREE_H, TREE_W, edgePath, innerRadius, labelLines, ordinal, rootFontSize, scoreText, slicesOf, treeLayout} from './tree';

/** SVG path for one ring slice from angle a0 to a1. */
const slicePath = (x: number, y: number, r: number, a0: number, a1: number) => {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x},${y} L${x + r * Math.cos(a0)},${y + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${x + r * Math.cos(a1)},${
    y + r * Math.sin(a1)
  } Z`;
};

/** Rough width of a name in the root circle, for choosing its font size. */
const approxWidth = (text: string, size: number) => text.length * size * 0.72;

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
      {nodes.map((n) => {
        const score = scoreText(n);
        return (
          <g key={n.id}>
            {n.colors.length === 1 ? (
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.colors[0]} />
            ) : (
              <>
                {slicesOf(n).map((sl) => (
                  <path
                    key={sl.color}
                    d={slicePath(n.x, n.y, n.r, sl.a0, sl.a1)}
                    fill={sl.color}
                    stroke='var(--pp-sheet)'
                    strokeWidth={2.5}
                  />
                ))}
                <circle cx={n.x} cy={n.y} r={innerRadius(n)} fill='var(--pp-sheet)' />
              </>
            )}
            {n.kind === 'root' && (
              <text
                x={n.x}
                y={n.y + 1}
                textAnchor='middle'
                dominantBaseline='middle'
                className='pp-tree__name'
                fontSize={rootFontSize(n.lines[0], (s) => approxWidth(n.lines[0], s))}>
                {n.lines[0]}
              </text>
            )}
            {score && (
              <text
                x={score.x}
                y={score.y + 1}
                textAnchor='middle'
                dominantBaseline='middle'
                fontSize={score.size}
                fontWeight={800}
                fill={score.fill === '#ffffff' ? '#ffffff' : 'var(--pp-ink)'}>
                {score.text}
              </text>
            )}
            {labelLines(n).map((l) => (
              <text key={l.text + l.y} x={n.x} y={l.y} textAnchor='middle' fontSize={l.size} fontWeight={l.weight} fill='var(--pp-ink)'>
                {l.text}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export default PersonalityTree;
