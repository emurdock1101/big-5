import React, {useEffect, useRef} from 'react';
import {TRAITS} from './traits';
import {slicesOf, TreeNode} from './tree';

/*
 * Pieces for the cinematic homepage and results (HomeCinematic, ResultsWalk look='cinematic').
 * Threads: ten colored threads, two per trait (its two aspects), woven into one ribbon.
 * Each trait holds one knot; its slider lifts or lowers that knot. Between knots the
 * ribbon fans out and twists, so the threads cross at every knot.
 * ColorWheel: the same ring the results use for "You" (five slices sized by score).
 */

const W = 600;
const H = 480;
const KNOT_X = [60, 180, 300, 420, 540];
const GAP = 12; // spread between neighboring threads at the widest point
const STEP = 6; // sampling step along x

// A resting swell, so the ribbon rolls like a wave even before anyone moves a slider.
const SWELL = [-60, 70, -45, 60, -35];
// Openness ink (#344B47) disappears on the night ground, so its threads use a lighter tint here.
const threadColor = (i: number) => (i === 4 ? '#6F9189' : TRAITS[i].color);

const clamp = (v: number) => Math.max(0, Math.min(100, v));
// With the swell (homepage guesses) the ribbon always rolls; without it (real results) each
// knot's height is the score alone, so the ribbon is the person's own profile.
const knotY = (score: number, i: number, swell = true) =>
  swell
    ? Math.max(36, Math.min(H - 36, 240 + SWELL[i] - (clamp(score) - 50) * 2.4))
    : 400 - clamp(score) * 3.2;

/** Catmull-Rom through the knots, extended flat past both edges. */
const centerY = (x: number, ys: number[]) => {
  const xs = [-60, ...KNOT_X, W + 60];
  const pts = [ys[0], ...ys, ys[ys.length - 1]];
  let j = 0;
  while (j < xs.length - 2 && x > xs[j + 1]) j++;
  const u = (x - xs[j]) / (xs[j + 1] - xs[j]);
  const p0 = pts[Math.max(0, j - 1)];
  const p1 = pts[j];
  const p2 = pts[j + 1];
  const p3 = pts[Math.min(pts.length - 1, j + 2)];
  const u2 = u * u;
  const u3 = u2 * u;
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
};

/** How far (and which way) the ribbon fans out at x: zero at each knot, alternating sides between them. */
const fan = (x: number) => {
  const xs = [-60, ...KNOT_X, W + 60];
  let j = 0;
  while (j < xs.length - 2 && x > xs[j + 1]) j++;
  const u = (x - xs[j]) / (xs[j + 1] - xs[j]);
  return Math.sin(Math.PI * u) * (j % 2 === 0 ? 1 : -1);
};

const threadPath = (k: number, ys: number[], t: number) => {
  const offset = (k - 4.5) * GAP;
  let d = '';
  for (let x = -20; x <= W + 20; x += STEP) {
    const drift = t ? 7 * Math.sin(x / 85 + t * 0.9 + k * 0.22) : 0;
    const y = centerY(x, ys) + offset * fan(x) + drift * Math.abs(fan(x));
    d += `${d ? 'L' : 'M'}${x} ${y.toFixed(1)}`;
  }
  return d;
};

interface ThreadsProps {
  /** Five scores 0–100 in E, N, A, C, O order. */
  scores: number[];
  focus?: number | null;
  label: string;
  /** False when the visitor asked for reduced motion: knots jump, nothing drifts. */
  motion: boolean;
  /** Give the ribbon a resting roll (homepage). Off for real results. */
  swell?: boolean;
  /** When set, each trait's knot and threads become a button that opens that trait. */
  onPick?: (index: number) => void;
}

const ordinal = (n: number) => {
  const v = Math.round(n);
  const s = ['th', 'st', 'nd', 'rd'];
  const m = v % 100;
  return v + (s[(m - 20) % 10] || s[m] || s[0]);
};

const Threads: React.FC<ThreadsProps> = ({scores, focus = null, label, motion, swell = true, onPick}) => {
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const knots = useRef<(SVGGElement | null)[]>([]);
  const hits = useRef<(SVGPathElement | null)[]>([]);
  const target = useRef(scores.map((v, i) => knotY(v, i, swell)));
  const shown = useRef(scores.map((v, i) => knotY(v, i, swell)));
  target.current = scores.map((v, i) => knotY(v, i, swell));

  useEffect(() => {
    const draw = (t: number) => {
      shown.current.forEach((y, i) => {
        knots.current[i]?.setAttribute('transform', `translate(${KNOT_X[i]} ${y.toFixed(1)})`);
      });
      paths.current.forEach((p, k) => p?.setAttribute('d', threadPath(k, shown.current, t)));
      hits.current.forEach((p, i) => p?.setAttribute('d', threadPath(2 * i + 0.5, shown.current, t)));
    };

    if (!motion) {
      shown.current = [...target.current];
      draw(0);
      return;
    }

    let frame = 0;
    let visible = true;
    const start = performance.now();
    const tick = (now: number) => {
      // Ease each knot toward its slider's value.
      shown.current = shown.current.map((y, i) => y + (target.current[i] - y) * 0.12);
      draw((now - start) / 1000);
      frame = visible ? requestAnimationFrame(tick) : 0;
    };
    frame = requestAnimationFrame(tick);

    // Pause the loop while the threads are off screen.
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible && !frame) frame = requestAnimationFrame(tick);
          })
        : null;
    if (svg.current && io) io.observe(svg.current);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, [motion]);

  // Without motion, redraw whenever the sliders move.
  useEffect(() => {
    if (motion) return;
    shown.current = scores.map((v, i) => knotY(v, i, swell));
    paths.current.forEach((p, k) => p?.setAttribute('d', threadPath(k, shown.current, 0)));
    hits.current.forEach((p, i) => p?.setAttribute('d', threadPath(2 * i + 0.5, shown.current, 0)));
    knots.current.forEach((c, i) => c?.setAttribute('transform', `translate(${KNOT_X[i]} ${shown.current[i].toFixed(1)})`));
  }, [scores, motion, swell]);

  const pick = (i: number) => (onPick ? () => onPick(i) : undefined);
  const onKey = (i: number) => (e: React.KeyboardEvent) => {
    if (!onPick || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    onPick(i);
  };

  return (
    <svg
      ref={svg}
      className={`pp-threads${onPick ? ' pp-threads--pick' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role={onPick ? 'group' : 'img'}
      aria-label={label}>
      <g fill='none' strokeLinecap='round'>
        {Array.from({length: 10}, (_, k) => {
          const trait = Math.floor(k / 2);
          const on = focus === trait;
          return (
            <path
              key={k}
              ref={(el) => (paths.current[k] = el)}
              className='pp-threads__thread'
              d={threadPath(k, shown.current, 0)}
              stroke={threadColor(trait)}
              strokeWidth={on ? 4 : 2.2}
              opacity={focus !== null && !on ? 0.35 : k % 2 ? 0.75 : 1}
            />
          );
        })}
      </g>
      {onPick && (
        <g fill='none' stroke='transparent' strokeWidth={30} aria-hidden='true'>
          {KNOT_X.map((_, i) => (
            <path
              key={i}
              ref={(el) => (hits.current[i] = el)}
              className='pp-threads__hit'
              d={threadPath(2 * i + 0.5, shown.current, 0)}
              onClick={pick(i)}
            />
          ))}
        </g>
      )}
      {KNOT_X.map((x, i) => (
        <g
          key={i}
          ref={(el) => (knots.current[i] = el)}
          className='pp-threads__knotbtn'
          transform={`translate(${x} ${shown.current[i]})`}
          role={onPick ? 'button' : undefined}
          tabIndex={onPick ? 0 : undefined}
          aria-label={onPick ? `${TRAITS[i].ocean}: ${ordinal(scores[i])} percentile. Open.` : undefined}
          onClick={pick(i)}
          onKeyDown={onKey(i)}>
          {onPick && <circle className='pp-threads__ring' r={20} />}
          <circle className='pp-threads__knot' r={focus === i ? 13 : 9} fill={threadColor(i)} />
        </g>
      ))}
    </svg>
  );
};

/** The five-color ring from the results ("You"), each slice sized by its score. Draws itself in. */
export const ColorWheel: React.FC<{scores: number[]; label: string}> = ({scores, label}) => {
  const r = 40;
  const C = 2 * Math.PI * r;
  const slices = slicesOf({colors: TRAITS.map((t) => t.color), weights: scores} as TreeNode);
  return (
    <svg className='pp-wheel' viewBox='0 0 100 100' role='img' aria-label={label} data-reveal='wheel'>
      {slices.map((s, i) => {
        const len = ((s.a1 - s.a0) / (Math.PI * 2)) * C;
        return (
          <circle
            key={s.color}
            className='pp-wheel__arc'
            cx={50}
            cy={50}
            r={r}
            fill='none'
            stroke={s.color}
            strokeWidth={16}
            transform={`rotate(${(s.a0 * 180) / Math.PI} 50 50)`}
            style={
              {
                '--dash': `${Math.max(0, len - 1.2)} ${C}`,
                '--dash0': `0 ${C}`,
                transitionDelay: `${0.15 + i * 0.16}s`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </svg>
  );
};

export default Threads;
