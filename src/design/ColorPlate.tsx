import React from 'react';
import {TRAITS} from './traits';

interface ColorPlateProps {
  /** Five scores 0–100 in E, N, A, C, O order. */
  scores: number[];
  /** Index of a trait to emphasise, or null. */
  focus?: number | null;
  label: string;
  /** When set, each band becomes a button that opens its trait. */
  onPick?: (index: number) => void;
}

/**
 * Albers-style nested squares: each trait is a ring, its thickness proportional to its score.
 * Extraversion is the outer field, Openness the centre square.
 */
const ColorPlate: React.FC<ColorPlateProps> = ({scores, focus = null, label, onPick}) => {
  // Each ring takes a share of the half-width (50%). Rings never vanish entirely: a low score
  // still shows a thin band, so all five colors are always present.
  const weights = scores.map((s, i) => {
    const base = 0.35 + Math.max(0, Math.min(100, s)) / 100;
    return focus === i ? base * 1.9 : base;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let inset = 0;
  // Offset the nesting slightly downward, as Albers' "Homage to the Square" does.
  return (
    <div className='pp-plate' role={onPick ? 'group' : 'img'} aria-label={label}>
      {TRAITS.map((t, i) => {
        const top = inset * 1.25;
        const side = inset;
        const bottom = inset * 0.75;
        const style: React.CSSProperties = {
          background: t.color,
          inset: `${top}% ${side}% ${bottom}% ${side}%`,
        };
        inset += (weights[i] / total) * 46;
        return onPick ? (
          <button
            key={t.ocean}
            type='button'
            className='pp-plate__sq pp-plate__sq--btn'
            style={style}
            aria-label={`${t.ocean}: ${Math.round(scores[i])}th percentile. Open.`}
            onClick={(e) => {
              e.stopPropagation();
              onPick(i);
            }}
          />
        ) : (
          <span key={t.ocean} className='pp-plate__sq' style={style} />
        );
      })}
    </div>
  );
};

export default ColorPlate;
