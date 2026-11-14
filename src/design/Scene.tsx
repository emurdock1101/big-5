import React from 'react';
import './cinematic.css';

/*
 * Drawn landscapes for the cinematic look: flat layered planes,
 * Albers-style, no outside images. Shared by the homepage, results and inner pages.
 */

const RIDGES = [
  '0,300 120,240 230,270 360,180 470,230 600,150 720,210 860,120 980,200 1100,160 1240,230 1440,170 1440,480 0,480',
  '0,360 150,290 280,330 420,250 560,320 700,260 820,300 960,230 1100,310 1260,250 1440,300 1440,480 0,480',
  '0,410 180,350 340,390 500,330 640,380 800,340 940,400 1120,350 1300,390 1440,360 1440,480 0,480',
  '0,450 200,420 420,440 620,410 860,445 1080,415 1300,440 1440,425 1440,480 0,480',
];

/** Carry a ridge past both edges so it can sway sideways without opening a gap. */
const widen = (pts: string) => {
  const p = pts.split(' ');
  const first = p[0].split(',')[1];
  const lastTop = p[p.length - 3].split(',')[1];
  return [`-120,${first}`, ...p.slice(0, -2), `1560,${lastTop}`, '1560,480', '-120,480'].join(' ');
};

// Sharp-crested swells: a slow rise to a pointed crest, a steep fall into a long trough.
const wavePath = (y: number, amp: number, len: number) => {
  let d = `M-720 ${y}`;
  for (let x = -720; x < 2160; x += len)
    d += ` q${len * 0.35} 0 ${len / 2} ${-amp} q${len * 0.12} ${amp} ${len / 2} ${amp}`;
  return `${d} V520 H-720 Z`;
};

const WAVES = [
  {y: 150, amp: 22, len: 240},
  {y: 220, amp: 38, len: 360},
  {y: 310, amp: 56, len: 480},
  {y: 410, amp: 44, len: 720},
];

/**
 * Layered flat planes, Albers-style: mountain ridges under a round sun, or a dark sea.
 * Decorative only. Layer colors come from CSS so each room can tint them.
 */
const Scene: React.FC<{
  kind: 'ridges' | 'waves';
  className?: string;
  sun?: string;
  sunX?: number;
  sunY?: number;
  /** Set the sun in front of the farthest range, for short bands where that range fills the sky. */
  sunFront?: boolean;
}> = ({
  kind,
  className,
  sun,
  sunX = 960,
  sunY = 70,
  sunFront = false,
}) => {
  const sunDisc = sun && (
    <g className='pp-scene__sun' style={{color: sun}}>
      <circle cx={sunX + 75} cy={sunY + 75} r={78} fill='currentColor' />
    </g>
  );
  return (
  <svg
    className={`pp-scene pp-scene--${kind}${className ? ' ' + className : ''}`}
    viewBox='0 0 1440 480'
    preserveAspectRatio='xMidYMax slice'
    aria-hidden='true'
    focusable='false'
    data-reveal='scene'>
    {!sunFront && sunDisc}
    {kind === 'ridges'
      ? RIDGES.map(widen).map((pts, i) => (
          <React.Fragment key={i}>
            <g className={`pp-scene__l pp-scene__l${i + 1}`}>
              <polygon points={pts} />
              {i < 3 && <rect className='pp-scene__fog' x={-120} y={300 + i * 50} width={1680} height={40} />}
            </g>
            {sunFront && i === 0 && sunDisc}
          </React.Fragment>
        ))
      : WAVES.map((w, i) => (
          <g key={i} className={`pp-scene__l pp-scene__l${i + 1}`}>
            <path
              className='pp-scene__wave'
              d={wavePath(w.y, w.amp, w.len)}
              style={{'--len': `${w.len}px`} as React.CSSProperties}
            />
          </g>
        ))}
  </svg>
  );
};

export default Scene;
