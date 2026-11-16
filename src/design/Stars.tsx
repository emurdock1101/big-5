import React from 'react';
import './cinematic.css';

/*
 * A drawn night sky for the dark rooms: small round stars at fixed places (the same on every
 * visit), a few of which twinkle slowly. Decorative only. The homepage's two night rooms carry
 * 26 and 44, seventy in all: a quiet nod to the seventy of Deuteronomy 32:8.
 */

// A tiny seeded random-number maker, so the sky never reshuffles between visits.
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const Stars: React.FC<{count: number; seed?: number; className?: string}> = ({count, seed = 82, className}) => {
  const rand = seeded(seed);
  const stars = Array.from({length: count}, () => ({
    x: 2 + rand() * 96,
    y: 3 + rand() * 94,
    r: 0.7 + rand() * rand() * 1.5,
    o: 0.35 + rand() * 0.55,
    twinkle: rand() < 0.4,
    delay: rand() * 6,
    pace: 3.5 + rand() * 4,
  }));
  return (
    <svg className={`pp-stars${className ? ' ' + className : ''}`} aria-hidden='true' focusable='false'>
      {stars.map((s, i) => (
        <circle
          key={i}
          className={s.twinkle ? 'pp-stars__twinkle' : undefined}
          cx={`${s.x.toFixed(2)}%`}
          cy={`${s.y.toFixed(2)}%`}
          r={s.r.toFixed(2)}
          opacity={s.o.toFixed(2)}
          style={s.twinkle ? {animationDelay: `-${s.delay.toFixed(1)}s`, animationDuration: `${s.pace.toFixed(1)}s`} : undefined}
        />
      ))}
    </svg>
  );
};

export default Stars;
