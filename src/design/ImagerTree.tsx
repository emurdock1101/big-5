import React, {useEffect, useState} from 'react';
import {TRAITS} from './traits';
import {Entry, GiftKind, itemById, PARTS, partDone, PartKey, PROMPTS} from '../constants/giftFinder';
import {IMAGER} from '../constants/giftFinderPages';
import {ord} from './GiftFinderOpening';
import {slicesOf, TreeNode} from './tree';

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
  /** Preview only: show draft labels. */
  sample?: boolean;
  /** A picture only (the buy page's sample): no zoom, no tapping, no detail panel. */
  still?: boolean;
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

/*
 * A quiet nod, like the homepage's hidden Psalm 82:1: "in our image, according to our likeness"
 * (Genesis 1:26) in Hebrew, out of focus on either side of the trunk under "Imager of God".
 * Tapping that root brings it into focus. Decorative; hidden from screen readers.
 */
const IMAGE_WORDS = ['בצלמנו', 'כדמותנו'];
const IMAGE_FONT =
  'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@700&display=swap' +
  `&text=${encodeURIComponent('בצלמנוכדת')}`;

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const leafR = (rank: number) => Math.max(11, 24 - rank * 1.6);
// The tree sits on the night panel, where Openness ink (#344B47) disappears; use its lighter thread tint.
const traitColor = (id: string) => {
  const c = TRAITS.find((t) => t.aspects.includes(itemById(id)!.aspect))!.color;
  return c === '#344B47' ? '#6F9189' : c;
};

/** The results color wheel ("You"): a ring of the five trait colors, each slice sized by its score. */
const MeWheel: React.FC<{x: number; y: number; r: number; scores: number[]}> = ({x, y, r, scores}) => {
  const band = Math.max(10, r * 0.4);
  const rr = r - band / 2;
  const C = 2 * Math.PI * rr;
  const slices = slicesOf({
    colors: TRAITS.map((t) => (t.color === '#344B47' ? '#6F9189' : t.color)),
    weights: scores,
  } as TreeNode);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill='#0b1226' />
      {slices.map((s) => {
        const len = ((s.a1 - s.a0) / (Math.PI * 2)) * C;
        return (
          <circle
            key={s.color}
            cx={x}
            cy={y}
            r={rr}
            fill='none'
            stroke={s.color}
            strokeWidth={band}
            strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`}
            transform={`rotate(${(s.a0 * 180) / Math.PI} ${x} ${y})`}
          />
        );
      })}
    </g>
  );
};

const ImagerTree: React.FC<Props> = ({name, p, gifts, blinds, entries, onWrite, seed, sample, still}) => {
  const narrow = useNarrow();

  // The hidden words' typeface: only the letters they need.
  useEffect(() => {
    const id = 'pp-image-font';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = IMAGE_FONT;
    document.head.appendChild(link);
  }, []);
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
  const labelMax = narrow ? 32 : 30;

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

  const keyed = (fn: () => void) =>
    still
      ? {}
      : {
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
  };

  // Each piece arrives in turn when the tree first shows: trunk, branches, then leaves.
  const later = (seconds: number) => ({'--d': `${seconds.toFixed(2)}s`}) as React.CSSProperties;

  const branch = (kind: GiftKind, ids: string[], hub: {x: number; y: number}, top: number) => {
    const n = seed ? ghosts : Math.max(ids.length, 1);
    const lastY = top + (n - 1) * step;
    const title = kind === 'gift' ? 'Gifts' : 'Blind spots';
    const color = kind === 'gift' ? 'var(--pp-c)' : 'var(--pp-n)';
    const start = me.y + me.r;
    const rail = W - 14;
    // On phones the blind-spot branch runs down the right edge and turns in under the last gift,
    // so it never crosses the gift labels.
    const limb =
      narrow && kind === 'blind'
        ? `M ${me.x} ${start} C ${me.x} ${start + 46}, ${rail} ${start - 6}, ${rail} ${start + 70} ` +
          `L ${rail} ${hub.y - 78} C ${rail} ${hub.y - 30}, ${hub.x} ${hub.y - 64}, ${hub.x} ${hub.y - 16}`
        : `M ${me.x} ${start} C ${me.x} ${hub.y - 30}, ${hub.x} ${start + 20}, ${hub.x} ${hub.y - 16}`;
    const wait = kind === 'gift' ? 0.3 : 0.45;
    return (
      <g>
        <path
          className='pp-tree-draw'
          style={later(wait)}
          pathLength={1}
          d={limb}
          fill='none'
          stroke='var(--tree-line)'
          strokeWidth={3}
        />
        <g className='pp-tree-pop' style={later(wait + 0.6)}>
          <rect
            x={hub.x - (narrow ? 44 : 62)}
            y={hub.y - 16}
            width={narrow ? 88 : 124}
            height={32}
            rx={16}
            fill={color}
          />
          <text x={hub.x} y={hub.y + 6} textAnchor='middle' className='pp-tree-hub'>
            {title}
          </text>
        </g>
        <line
          className='pp-tree-draw'
          style={later(wait + 0.7)}
          pathLength={1}
          x1={hub.x}
          y1={hub.y + 16}
          x2={hub.x}
          y2={lastY}
          stroke='var(--tree-line)'
          strokeWidth={2}
        />
        {seed || ids.length === 0
          ? Array.from({length: seed ? ghosts : 1}).map((_, i) => {
              const y = top + i * step;
              const side = labelSide(kind);
              return (
                <g key={i} className='pp-tree-pop' style={later(wait + 0.9 + i * 0.1)}>
                  <circle
                    cx={hub.x}
                    cy={y}
                    r={14}
                    fill='var(--tree-bg)'
                    stroke='var(--tree-twig)'
                    strokeDasharray='4 4'
                    strokeWidth={2}
                  />
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
                  className={`pp-tree-leaf pp-tree-pop${on ? ' is-on' : ''}`}
                  style={later(wait + 0.9 + i * 0.1)}
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
                          stroke='var(--tree-twig)'
                          strokeWidth={1.5}
                        />
                        <circle
                          className={done ? 'pp-tree-dot is-done' : 'pp-tree-dot'}
                          cx={ox}
                          cy={oy}
                          r={5}
                          fill={done ? traitColor(id) : 'var(--tree-bg)'}
                          stroke={traitColor(id)}
                          strokeWidth={2}>
                          <title>
                            {PART_NAME[kind][part]}: {done ? 'written' : 'not yet'}
                          </title>
                        </circle>
                      </g>
                    );
                  })}
                  <circle cx={x} cy={y} r={r} fill={traitColor(id)} stroke='var(--tree-on)' strokeWidth={on ? 4 : 0} />
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
          Imager of God {sample && IMAGER.draft && <span className='pp-gf-draft'>Draft · Patrick to write</span>}
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
            {sel.kind === 'gift' ? 'Gift' : 'Blind spot'} {sel.idx + 1} · from your {item.aspect} ({ord(p(item.aspect))}
            )
          </p>
          <h3 className='pp-display pp-h3'>{item.text}</h3>
          <dl className='pp-tree-parts'>
            {PARTS.map((part) => {
              const text =
                part === 'story'
                  ? [e?.story, ...pr.abcd.map((q) => (e?.[q.key] ? `${q.label}: ${e[q.key]}` : ''))]
                      .filter(Boolean)
                      .join('\n')
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
    <div className={`pp-tree${still ? ' pp-tree--still' : ''}`}>
      {!still && (
      <div className='pp-tree__tools'>
        <button
          type='button'
          aria-label='Zoom out'
          disabled={zoom <= 1}
          onClick={() => (zoom - 0.4 <= 1 ? reset() : setZoom(zoom - 0.4))}>
          −
        </button>
        <button type='button' aria-label='Zoom in' disabled={zoom >= 2.6} onClick={() => setZoom(zoom + 0.4)}>
          +
        </button>
        <button type='button' className='pp-tree__whole' disabled={zoom === 1 && !sel} onClick={reset}>
          Whole tree
        </button>
      </div>
      )}
      <div className='pp-tree__frame' onClick={still ? undefined : reset}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role={still ? 'img' : 'group'}
          aria-label={still ? 'A sample imager tree' : 'Your imager tree'}>
          <g className='pp-tree__zoom' style={{transform}}>
            <g className={`pp-tree-unseen${sel?.type === 'imager' ? ' is-clear' : ''}`} aria-hidden='true' lang='he'>
              <text x={imager.x + 12} y={(imager.y + imager.h / 2 + me.y - me.r) / 2 + 8} fontSize={narrow ? 20 : 24}>
                {IMAGE_WORDS[0]}
              </text>
              <text
                x={imager.x - 12}
                y={(imager.y + imager.h / 2 + me.y - me.r) / 2 + 8}
                fontSize={narrow ? 20 : 24}
                textAnchor='end'>
                {IMAGE_WORDS[1]}
              </text>
            </g>
            <line
              className='pp-tree-draw'
              pathLength={1}
              x1={imager.x}
              y1={imager.y + imager.h / 2}
              x2={me.x}
              y2={me.y - me.r}
              stroke='var(--tree-line)'
              strokeWidth={3}
            />
            {branch('gift', gList, gHub, gTop)}
            {branch('blind', bList, bHub, bTop)}
            <g
              className={`pp-tree-node${sel?.type === 'imager' ? ' is-on' : ''}`}
              aria-label='Imager of God'
              {...keyed(() => choose({type: 'imager'}, imager.x, imager.y + 40))}>
              <rect
                x={imager.x - imager.w / 2}
                y={imager.y - imager.h / 2}
                width={imager.w}
                height={imager.h}
                rx={imager.h / 2}
                fill='var(--tree-imager)'
              />
              <text x={imager.x} y={imager.y + 8} textAnchor='middle' className='pp-tree-imager'>
                Imager of God
              </text>
            </g>
            <g
              className={`pp-tree-node${sel?.type === 'me' ? ' is-on' : ''}`}
              aria-label={`${name ?? 'Me'}: your five traits`}
              {...keyed(() => choose({type: 'me'}, me.x, me.y))}>
              <MeWheel x={me.x} y={me.y} r={me.r} scores={scores} />
              <text x={me.x + me.r + 12} y={me.y + 6} className='pp-tree-me-label'>
                {name ?? 'Me'}
              </text>
            </g>
          </g>
        </svg>
      </div>
      {!still && (
        <div className='pp-tree__panel' aria-live='polite'>
          {panel}
        </div>
      )}
    </div>
  );
};

export default ImagerTree;
