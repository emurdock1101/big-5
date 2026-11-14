import React, {useEffect, useState} from 'react';
import {TRAITS} from './traits';
import {Entry, GiftKind, itemById, PARTS, partDone, PartKey, PROMPTS} from '../constants/giftFinder';
import {IMAGER} from '../constants/giftFinderPages';
import {ord} from './GiftFinderOpening';

/**
 * The Imager tree: Imager of God at the top, then "me", then two branches (gifts and blind spots).
 * Each kept item is a leaf, sized by its rank, with four small offshoots for the four parts of the
 * writing (filled once written). Tap a node to zoom in and open it.
 */

interface Props {
  name?: string;
  p: (a: string) => number;
  gifts: string[];
  blinds: string[];
  entries: Record<string, Entry>;
  /** Jump to the writing page for one item. */
  onWrite?: (kind: GiftKind, index: number) => void;
  /** The first look: only the top of the tree, with empty branches. */
  seed?: boolean;
}

type Sel = {type: 'imager'} | {type: 'me'} | {type: 'item'; kind: GiftKind; idx: number} | null;

const PART_NAME: Record<GiftKind, Record<PartKey, string>> = {
  gift: {
    story: PROMPTS.gift.story.title,
    better: PROMPTS.gift.better.title,
    forward: PROMPTS.gift.forward.title,
    serve: PROMPTS.gift.serve.title,
  },
  blind: {
    story: PROMPTS.blind.story.title,
    better: PROMPTS.blind.better.title,
    forward: PROMPTS.blind.forward.title,
    serve: PROMPTS.blind.serve.title,
  },
};

const useNarrow = () => {
  const q = '(max-width: 640px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setNarrow(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return narrow;
};

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const leafR = (rank: number) => Math.max(11, 24 - rank * 1.6);
const traitColor = (id: string) => TRAITS.find((t) => t.aspects.includes(itemById(id)!.aspect))!.color;

/** A pie of the five trait colors, each slice sized by the score. */
const MePie: React.FC<{x: number; y: number; r: number; scores: number[]}> = ({x, y, r, scores}) => {
  const w = scores.map((s) => 0.35 + s / 100);
  const tot = w.reduce((a, b) => a + b, 0);
  let a0 = -Math.PI / 2;
  return (
    <g>
      {TRAITS.map((t, i) => {
        const a1 = a0 + (w[i] / tot) * Math.PI * 2;
        const d = `M ${x} ${y} L ${x + r * Math.cos(a0)} ${y + r * Math.sin(a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${
          x + r * Math.cos(a1)
        } ${y + r * Math.sin(a1)} Z`;
        a0 = a1;
        return <path key={t.ocean} d={d} fill={t.color} />;
      })}
      <circle cx={x} cy={y} r={r} fill='none' stroke='var(--pp-ink)' strokeWidth={2} />
    </g>
  );
};

const ImagerTree: React.FC<Props> = ({name, p, gifts, blinds, entries, onWrite, seed}) => {
  const narrow = useNarrow();
  const [sel, setSel] = useState<Sel>(null);
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState<[number, number] | null>(null);

  const scores = TRAITS.map((t) => p(t.ocean));
  const gList = seed ? [] : gifts;
  const bList = seed ? [] : blinds;

  // ---- layout ----
  const W = narrow ? 420 : 1000;
  const step = narrow ? 60 : 68;
  const ghosts = 3;
  const gCount = seed ? ghosts : Math.max(gList.length, 1);
  const bCount = seed ? ghosts : Math.max(bList.length, 1);
  const imager = {x: W / 2, y: narrow ? 40 : 48, w: narrow ? 240 : 280, h: narrow ? 48 : 56};
  const me = {x: W / 2, y: narrow ? 128 : 148, r: narrow ? 30 : 36};
  const gHub = narrow ? {x: 52, y: 220} : {x: 300, y: 250};
  const gTop = gHub.y + (narrow ? 52 : 66);
  const bHub = narrow ? {x: 52, y: gTop + gCount * step + 40} : {x: 700, y: 250};
  const bTop = bHub.y + (narrow ? 52 : 66);
  const H = narrow ? bTop + bCount * step + 20 : gTop + Math.max(gCount, bCount) * step + 20;
  const labelMax = narrow ? 34 : 30;

  const leafPos = (kind: GiftKind, i: number) =>
    kind === 'gift' ? {x: gHub.x, y: gTop + i * step} : {x: bHub.x, y: bTop + i * step};
  // gifts (wide) open toward the middle on the right; everything else opens left
  const shootDir = (kind: GiftKind) => (narrow ? Math.PI : kind === 'gift' ? 0 : Math.PI);
  const labelSide = (kind: GiftKind) => (narrow ? 'right' : kind === 'gift' ? 'left' : 'right');

  const center = (x: number, y: number, z: number) => {
    setFocus([x, y]);
    setZoom(z);
  };
  const reset = () => {
    setSel(null);
    setFocus(null);
    setZoom(1);
  };
  const choose = (s: Sel, x: number, y: number) => {
    setSel(s);
    center(x, y, narrow ? 1.4 : 1.6);
  };

  const [fx, fy] = focus ?? [W / 2, H / 2];
  const transform = `translate(${W / 2}px, ${H / 2}px) scale(${zoom}) translate(${-fx}px, ${-fy}px)`;

  const keyed = (fn: () => void) => ({
    role: 'button',
    tabIndex: 0,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      fn();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fn();
      }
    },
  });

  const branch = (kind: GiftKind, ids: string[], hub: {x: number; y: number}, top: number) => {
    const n = seed ? ghosts : Math.max(ids.length, 1);
    const lastY = top + (n - 1) * step;
    const title = kind === 'gift' ? 'Gifts' : 'Blind spots';
    const color = kind === 'gift' ? 'var(--pp-c)' : 'var(--pp-n)';
    return (
      <g>
        <path
          d={`M ${me.x} ${me.y + me.r} C ${me.x} ${hub.y - 30}, ${hub.x} ${me.y + me.r + 20}, ${hub.x} ${hub.y - 16}`}
          fill='none'
          stroke='var(--pp-ink)'
          strokeWidth={3}
        />
        <rect x={hub.x - (narrow ? 44 : 62)} y={hub.y - 16} width={narrow ? 88 : 124} height={32} fill={color} />
        <text x={hub.x} y={hub.y + 6} textAnchor='middle' className='pp-tree-hub'>
          {title}
        </text>
        <line x1={hub.x} y1={hub.y + 16} x2={hub.x} y2={lastY} stroke='var(--pp-ink)' strokeWidth={2} />
        {seed || ids.length === 0
          ? Array.from({length: seed ? ghosts : 1}).map((_, i) => {
              const y = top + i * step;
              const side = labelSide(kind);
              return (
                <g key={i}>
                  <circle cx={hub.x} cy={y} r={14} fill='var(--pp-sheet)' stroke='var(--pp-ink-soft)' strokeDasharray='4 4' strokeWidth={2} />
                  {i === 0 && (
                    <text
                      x={side === 'left' ? hub.x - 28 : hub.x + 28}
                      y={y + 5}
                      textAnchor={side === 'left' ? 'end' : 'start'}
                      className='pp-tree-ghost'>
                      {seed ? `Your ${title.toLowerCase()} will grow here` : `No ${title.toLowerCase()} kept yet`}
                    </text>
                  )}
                </g>
              );
            })
          : ids.map((id, i) => {
              const {x, y} = leafPos(kind, i);
              const r = leafR(i);
              const on = sel?.type === 'item' && sel.kind === kind && sel.idx === i;
              const side = labelSide(kind);
              const dir = shootDir(kind);
              const item = itemById(id)!;
              return (
                <g
                  key={id}
                  className={`pp-tree-leaf${on ? ' is-on' : ''}`}
                  aria-label={`${kind === 'gift' ? 'Gift' : 'Blind spot'} ${i + 1}: ${item.text}`}
                  {...keyed(() => choose({type: 'item', kind, idx: i}, x, y))}>
                  {PARTS.map((part, k) => {
                    const a = dir + ((k - 1.5) * Math.PI) / 7;
                    const ox = x + Math.cos(a) * (r + 12);
                    const oy = y + Math.sin(a) * (r + 12);
                    const done = partDone(entries[id], part);
                    return (
                      <g key={part}>
                        <line
                          x1={x + Math.cos(a) * r}
                          y1={y + Math.sin(a) * r}
                          x2={ox}
                          y2={oy}
                          stroke='var(--pp-ink-soft)'
                          strokeWidth={1.5}
                        />
                        <circle
                          cx={ox}
                          cy={oy}
                          r={5}
                          fill={done ? traitColor(id) : 'var(--pp-sheet)'}
                          stroke={traitColor(id)}
                          strokeWidth={2}>
                          <title>
                            {PART_NAME[kind][part]}: {done ? 'written' : 'not yet'}
                          </title>
                        </circle>
                      </g>
                    );
                  })}
                  <circle cx={x} cy={y} r={r} fill={traitColor(id)} stroke='var(--pp-ink)' strokeWidth={on ? 4 : 0} />
                  <text x={x} y={y + 5} textAnchor='middle' className='pp-tree-rank'>
                    {i + 1}
                  </text>
                  <text
                    x={side === 'left' ? x - r - 22 : x + r + (narrow ? 10 : 22)}
                    y={y + 5}
                    textAnchor={side === 'left' ? 'end' : 'start'}
                    className='pp-tree-label'>
                    {clip(item.text, labelMax)}
                  </text>
                </g>
              );
            })}
      </g>
    );
  };

  // ---- detail panel ----
  let panel: React.ReactNode = (
    <p className='pp-small' style={{margin: 0}}>
      Tap any part of the tree to open it. Bigger leaves are the ones you ranked higher. The small dots around each leaf
      fill in as you write its four parts.
    </p>
  );
  if (sel?.type === 'imager') {
    panel = (
      <>
        <p className='pp-gf-group' style={{margin: 0}}>
          Imager of God {IMAGER.draft && <span className='pp-gf-draft'>Draft · Patrick to write</span>}
        </p>
        {IMAGER.paragraphs.slice(1).map((t) => (
          <p key={t} style={{margin: 0}}>
            {t}
          </p>
        ))}
        <p className='pp-small' style={{margin: 0}}>
          {IMAGER.verse}
        </p>
      </>
    );
  } else if (sel?.type === 'me') {
    panel = (
      <>
        <p className='pp-gf-group' style={{margin: 0}}>
          {name ?? 'You'}: how you are built
        </p>
        <ul className='pp-tree-me'>
          {TRAITS.map((t, i) => (
            <li key={t.ocean} style={{'--pp-step': t.color} as React.CSSProperties}>
              {t.ocean} <b>{ord(scores[i])}</b>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (sel?.type === 'item') {
    const ids = sel.kind === 'gift' ? gList : bList;
    const id = ids[sel.idx];
    const item = id ? itemById(id) : undefined;
    if (item) {
      const e = entries[id];
      const pr = PROMPTS[sel.kind];
      panel = (
        <>
          <p className='pp-gf-group' style={{margin: 0}}>
            {sel.kind === 'gift' ? 'Gift' : 'Blind spot'} {sel.idx + 1} · from your {item.aspect} ({ord(p(item.aspect))})
          </p>
          <h3 className='pp-display pp-h3'>{item.text}</h3>
          <dl className='pp-tree-parts'>
            {PARTS.map((part) => {
              const text =
                part === 'story'
                  ? [e?.story, ...pr.abcd.map((q) => (e?.[q.key] ? `${q.label}: ${e[q.key]}` : ''))].filter(Boolean).join('\n')
                  : e?.[part];
              return (
                <div key={part} className={partDone(e, part) ? 'is-done' : undefined}>
                  <dt>{PART_NAME[sel.kind][part]}</dt>
                  <dd>{text ? text : <span className='pp-small'>Not written yet.</span>}</dd>
                </div>
              );
            })}
          </dl>
          {onWrite && (
            <button type='button' className='pp-btn pp-btn--sm' onClick={() => onWrite(sel.kind, sel.idx)}>
              Write about this one
            </button>
          )}
        </>
      );
    }
  }

  return (
    <div className='pp-tree'>
      <div className='pp-tree__tools'>
        <button type='button' aria-label='Zoom out' disabled={zoom <= 1} onClick={() => (zoom - 0.4 <= 1 ? reset() : setZoom(zoom - 0.4))}>
          −
        </button>
        <button type='button' aria-label='Zoom in' disabled={zoom >= 2.6} onClick={() => setZoom(zoom + 0.4)}>
          +
        </button>
        <button type='button' className='pp-tree__whole' disabled={zoom === 1 && !sel} onClick={reset}>
          Whole tree
        </button>
      </div>
      <div className='pp-tree__frame' onClick={reset}>
        <svg viewBox={`0 0 ${W} ${H}`} role='group' aria-label='Your imager tree'>
          <g className='pp-tree__zoom' style={{transform}}>
            <line x1={imager.x} y1={imager.y + imager.h / 2} x2={me.x} y2={me.y - me.r} stroke='var(--pp-ink)' strokeWidth={3} />
            {branch('gift', gList, gHub, gTop)}
            {branch('blind', bList, bHub, bTop)}
            <g className={`pp-tree-node${sel?.type === 'imager' ? ' is-on' : ''}`} aria-label='Imager of God' {...keyed(() => choose({type: 'imager'}, imager.x, imager.y + 40))}>
              <rect x={imager.x - imager.w / 2} y={imager.y - imager.h / 2} width={imager.w} height={imager.h} fill='var(--pp-ink)' />
              <text x={imager.x} y={imager.y + 8} textAnchor='middle' className='pp-tree-imager'>
                Imager of God
              </text>
            </g>
            <g className={`pp-tree-node${sel?.type === 'me' ? ' is-on' : ''}`} aria-label={`${name ?? 'Me'}: your five traits`} {...keyed(() => choose({type: 'me'}, me.x, me.y))}>
              <MePie x={me.x} y={me.y} r={me.r} scores={scores} />
              <text x={me.x + me.r + 12} y={me.y + 6} className='pp-tree-me-label'>
                {name ?? 'Me'}
              </text>
            </g>
          </g>
        </svg>
      </div>
      <div className='pp-tree__panel' aria-live='polite'>
        {panel}
      </div>
    </div>
  );
};

export default ImagerTree;
