import React from 'react';
import {TRAITS} from './traits';
import {ordinal, slicesOf, TreeNode} from './tree';
import {fillRub, rubs} from '../constants/rubs';
import {alikes, alikeSide} from '../constants/alikes';

/** The other person's color everywhere in a comparison. Yours are the trait colors. */
export const THEM_COLOR = '#c68a12';
/** A darker version that reads as text on the light background. */
export const THEM_TEXT = '#8a5d00';

/** Points apart before two scores count as a place you may rub. */
export const RUB_GAP = 30;
/** How many of the biggest differences show before "Show more". */
const SHOW_RUBS = 4;
/** Points apart or closer to count as alike. */
export const ALIKE_GAP = 10;

export interface Person {
  name: string;
  percentiles: Record<string, number>;
}

interface Dim {
  key: string;
  label: string;
  color: string;
  trait: boolean;
}

const DIMS: Dim[] = TRAITS.flatMap((t) => [
  {key: t.ocean, label: t.ocean, color: t.color, trait: true},
  ...t.aspects.map((a) => ({key: a, label: a, color: t.color, trait: false})),
]);

const slicePath = (x: number, y: number, r: number, a0: number, a1: number) => {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x},${y} L${x + r * Math.cos(a0)},${y + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${x + r * Math.cos(a1)},${
    y + r * Math.sin(a1)
  } Z`;
};

/** A person's name inside a ring split by their five trait scores. */
export const NameRing: React.FC<{person: Person; outline?: string}> = ({person, outline}) => {
  const node: TreeNode = {
    id: 'ring',
    kind: 'root',
    lines: [person.name],
    x: 70,
    y: 70,
    r: 62,
    rMax: 62,
    colors: TRAITS.map((t) => t.color),
    weights: TRAITS.map((t) => person.percentiles[t.ocean] ?? 0),
  };
  const size = Math.max(14, Math.min(26, 150 / Math.max(3, person.name.length)));
  return (
    <svg viewBox='0 0 140 140' className='pp-ring' role='img' aria-label={`${person.name}’s five colors`}>
      {outline && <circle cx={70} cy={70} r={68} fill='none' stroke={outline} strokeWidth={4} />}
      {slicesOf(node).map((s) => (
        <path
          key={s.color}
          d={slicePath(70, 70, 62, s.a0, s.a1)}
          fill={s.color}
          stroke='var(--pp-sheet)'
          strokeWidth={2}
        />
      ))}
      <circle cx={70} cy={70} r={46} fill='var(--pp-sheet)' />
      <text x={70} y={71} textAnchor='middle' dominantBaseline='middle' className='pp-tree__name' fontSize={size}>
        {person.name}
      </text>
    </svg>
  );
};

const Pair: React.FC<{dim: Dim; me: number; them: number; themName: string}> = ({dim, me, them, themName}) => (
  <div className='pp-pair'>
    {[
      {who: 'You', v: me, color: dim.color},
      {who: themName, v: them, color: THEM_COLOR},
    ].map((r) => (
      <div key={r.who} className='pp-pair__row'>
        <span className='pp-pair__who'>{r.who}</span>
        <span className='pp-pair__track' aria-hidden='true'>
          <span style={{width: `${r.v}%`, background: r.color}} />
        </span>
        <span className='pp-pair__val'>{ordinal(r.v)}</span>
      </div>
    ))}
  </div>
);

/** Your results next to someone else's: where you are alike, where you may rub, and every score side by side. */
const CompareView: React.FC<{me: Person; them: Person; relationship?: string; after?: React.ReactNode}> = ({
  me,
  them,
  relationship,
  after,
}) => {
  const rows = DIMS.map((d) => {
    const a = Math.round(me.percentiles[d.key] ?? 0);
    const b = Math.round(them.percentiles[d.key] ?? 0);
    return {d, me: a, them: b, gap: Math.abs(a - b)};
  });
  const rubRows = rows.filter((r) => r.gap >= RUB_GAP).sort((x, y) => y.gap - x.gap);
  const alike = rows.filter((r) => r.gap <= ALIKE_GAP);
  // Both high or both low get a card, strongest first; both in the middle get one line.
  const alikeCards = alike
    .filter((r) => alikeSide(r.me, r.them))
    .sort((x, y) => Math.abs((y.me + y.them) / 2 - 50) - Math.abs((x.me + x.them) / 2 - 50));
  const middle = alike.filter((r) => !alikeSide(r.me, r.them));

  const alikeTitle = (side: 'high' | 'low', a: number, b: number) => {
    const avg = (a + b) / 2;
    const strong = side === 'high' ? avg >= 75 : avg < 25;
    return strong ? `You’re both ${side} in` : `You both lean ${side} in`;
  };

  const alikeCard = (r: (typeof rows)[number]) => {
    const side = alikeSide(r.me, r.them)!;
    const note = alikes[r.d.key]?.[side];
    return (
      <article key={r.d.key} className='pp-rub pp-rub--alike'>
        <h3 className='pp-rub__title'>
          {alikeTitle(side, r.me, r.them)} {r.d.label}.
        </h3>
        <Pair dim={r.d} me={r.me} them={r.them} themName={them.name} />
        {note && (
          <>
            <p>{note.share}</p>
            <p>
              <b>Shared blind spot:</b> {note.watch}
            </p>
            <p className='pp-rub__try'>
              <b>Try this together:</b> {note.together}
            </p>
          </>
        )}
      </article>
    );
  };

  const rubCard = (r: (typeof rows)[number]) => {
    const note = rubs[r.d.key];
    const hi = r.me >= r.them ? 'You' : them.name;
    const lo = r.me >= r.them ? them.name : 'You';
    return (
      <article key={r.d.key} className='pp-rub'>
        <h3 className='pp-rub__title'>
          You’re {r.gap} points apart on {r.d.label}.
        </h3>
        <Pair dim={r.d} me={r.me} them={r.them} themName={them.name} />
        {note && (
          <>
            <p>{fillRub(note.hi, hi, lo)}</p>
            <p>{fillRub(note.lo, hi, lo)}</p>
            <p className='pp-rub__try'>
              <b>Try this together:</b> {fillRub(note.together, hi, lo)}
            </p>
          </>
        )}
      </article>
    );
  };

  return (
    <div className='pp pp-compare'>
      <div className='pp-wrap'>
        <header className='pp-compare__head'>
          {relationship && <p className='pp-split__kicker'>Compared with your {relationship.toLowerCase()}</p>}
          <h1 className='pp-display pp-h2'>You and {them.name}</h1>
          <div className='pp-compare__rings'>
            <figure>
              <NameRing person={{...me, name: 'You'}} />
              <figcaption>Your colors</figcaption>
            </figure>
            <figure>
              <NameRing person={them} outline={THEM_COLOR} />
              <figcaption>{them.name}’s colors</figcaption>
            </figure>
          </div>
          <p className='pp-compare__legend'>
            <span className='pp-compare__swatch pp-compare__swatch--you' aria-hidden='true' /> You, in the trait colors
            <span className='pp-compare__swatch' style={{background: THEM_COLOR}} aria-hidden='true' /> {them.name}, in
            gold
          </p>
        </header>

        <section className='pp-compare__section'>
          <h2 className='pp-display pp-h3'>Where you’re alike</h2>
          {alikeCards.length === 0 && middle.length === 0 ? (
            <p>No scores sit within {ALIKE_GAP} points of each other, so you will often see things differently.</p>
          ) : (
            <>
              {alikeCards.length > 0 && (
                <div className='pp-compare__rubs'>{alikeCards.slice(0, SHOW_RUBS).map((r) => alikeCard(r))}</div>
              )}
              {alikeCards.length > SHOW_RUBS && (
                <details className='pp-walk__more'>
                  <summary>
                    Show {alikeCards.length - SHOW_RUBS} more {alikeCards.length - SHOW_RUBS === 1 ? 'place' : 'places'}{' '}
                    you’re alike
                  </summary>
                  <div className='pp-compare__rubs'>{alikeCards.slice(SHOW_RUBS).map((r) => alikeCard(r))}</div>
                </details>
              )}
              {middle.length > 0 && (
                <p className='pp-compare__middle'>
                  You both sit near the middle on <b>{middle.map((r) => r.d.label).join(', ')}</b>, so neither of you
                  pulls the other far on {middle.length === 1 ? 'it' : 'these'}.
                </p>
              )}
            </>
          )}
        </section>

        <section className='pp-compare__section'>
          <h2 className='pp-display pp-h3'>Where you may rub</h2>
          {rubRows.length === 0 ? (
            <p>
              No score sits {RUB_GAP} or more points apart. You are wired much alike, which makes it easy to understand
              each other, and easy to share the same blind spots.
            </p>
          ) : (
            <>
              <div className='pp-compare__rubs'>{rubRows.slice(0, SHOW_RUBS).map((r) => rubCard(r))}</div>
              {rubRows.length > SHOW_RUBS && (
                <details className='pp-walk__more'>
                  <summary>
                    Show {rubRows.length - SHOW_RUBS} more {rubRows.length - SHOW_RUBS === 1 ? 'place' : 'places'} you
                    differ
                  </summary>
                  <div className='pp-compare__rubs'>{rubRows.slice(SHOW_RUBS).map((r) => rubCard(r))}</div>
                </details>
              )}
            </>
          )}
        </section>

        <section className='pp-compare__section'>
          <h2 className='pp-display pp-h3'>Side by side</h2>
          <div className='pp-compare__all'>
            {TRAITS.map((t) => (
              <div key={t.ocean} className='pp-compare__trait'>
                {rows
                  .filter((r) => r.d.key === t.ocean || (t.aspects as string[]).includes(r.d.key))
                  .map((r) => (
                    <div key={r.d.key} className={`pp-compare__row${r.d.trait ? ' is-trait' : ''}`}>
                      <p className='pp-compare__label'>
                        {r.d.label}
                        {r.gap >= RUB_GAP && <span className='pp-compare__gap'>{r.gap} apart</span>}
                      </p>
                      <Pair dim={r.d} me={r.me} them={r.them} themName={them.name} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <p className='pp-small' style={{marginTop: 24}}>
            Each person’s scores compare them with other people of their own sex who took the test.
          </p>
        </section>
        {after}
      </div>
    </div>
  );
};

export default CompareView;
