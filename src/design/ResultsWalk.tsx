import React, {useEffect, useRef, useState} from 'react';
import ColorPlate from './ColorPlate';
import {BOOKING_LABEL, BOOKING_URL, SOFT_NAME, TRAITS} from './traits';
import {getInterpretation, getScoreLevel} from '../utils/interpretations.utils';
import {getShortWriteup, ShortWriteup} from '../constants/shortWriteups';
import {traitOverviews} from '../constants/content';
import {combinationNote} from '../constants/combinations';
import {aspectSplit} from '../constants/aspectSplits';
import PersonalityTree from './PersonalityTree';
import {FACTOR_NAME} from './tree';

interface ResultsWalkProps {
  percentiles: Record<string, number>;
  /** 'male' | 'female' — the comparison group scores were normed against. */
  gender: string;
  /** The name the person gave before the test, if any. */
  name?: string;
  /** The "Compare with someone" panel, shown on the last step. */
  share?: React.ReactNode;
  onDownload: () => void;
  /** Shown on the preview page only. */
  sample?: boolean;
}

const STEPS = ['Overview', ...TRAITS.map((t) => t.ocean as string), 'Combinations', 'Keep and compare'];

const ord = (n: number) => {
  const v = Math.round(n);
  const s = v % 100 >= 11 && v % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][v % 10] || 'th';
  return `${v}${s}`;
};

const levelWord = (p: number) =>
  p >= 90
    ? 'very high'
    : p >= 75
      ? 'high'
      : p >= 60
        ? 'moderately high'
        : p >= 40
          ? 'average'
          : p >= 25
            ? 'moderately low'
            : p >= 10
              ? 'low'
              : 'very low';

const Scale: React.FC<{label: string; value: number; color: string; big?: boolean}> = ({label, value, color, big}) => (
  <div className={`pp-rscale${big ? ' pp-rscale--big' : ''}`}>
    <div className='pp-scale__row'>
      <span>{label}</span>
      <span className='pp-rscale__val'>
        {ord(value)} percentile · {levelWord(value)}
      </span>
    </div>
    <div className='pp-scale__track' role='img' aria-label={`${label}: ${ord(value)} percentile, ${levelWord(value)}`}>
      <span className='pp-scale__fill' style={{width: `${value}%`, background: color}} />
    </div>
  </div>
);

/**
 * The short card for a trait or aspect, with the full write-up folded behind a disclosure.
 * `card` overrides the level card (used for a split trait's mix card).
 */
const Paragraphs: React.FC<{trait: string; score: number; first?: boolean; card?: ShortWriteup}> = ({
  trait,
  score,
  first = true,
  card,
}) => {
  const interp = getInterpretation(trait, score);
  if (!interp) return null;
  const short = card ?? getShortWriteup(trait, getScoreLevel(score));
  if (short) {
    return (
      <>
        <p className={first ? 'pp-walk__first' : 'pp-walk__head'}>{short.headline}</p>
        <dl className='pp-short'>
          <div className='pp-short__gift'>
            <dt>Your gift</dt>
            <dd>{short.gift}</dd>
          </div>
          <div>
            <dt>Shows up as</dt>
            <dd>
              <ul>
                {short.showsUp.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Watch for</dt>
            <dd>{short.watchFor}</dd>
          </div>
          <div>
            <dt>Try this</dt>
            <dd>{short.tryThis}</dd>
          </div>
        </dl>
        <details className='pp-walk__more'>
          <summary>{card ? `Read the full ${trait.toLowerCase()} write-up` : 'Read the full write-up'}</summary>
          {interp.paragraphs.filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </details>
      </>
    );
  }
  const [lead, ...rest] = interp.paragraphs.filter(Boolean);
  return (
    <>
      <p className={first ? 'pp-walk__first' : undefined}>{lead}</p>
      {rest.length > 0 && (
        <details className='pp-walk__more'>
          <summary>Read more</summary>
          {rest.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </details>
      )}
    </>
  );
};

/** Two aspect bars side by side, with the gap between them. */
const SplitCard: React.FC<{
  trait: (typeof TRAITS)[number];
  a: number;
  b: number;
  compact?: boolean;
}> = ({trait, a, b, compact}) => {
  const s = aspectSplit(trait.ocean, a, b);
  return (
    <div className={`pp-split${s.split ? ' is-split' : ''}`}>
      {!compact && (
        <p className='pp-split__kicker'>{s.split ? 'A split inside this trait' : 'Your two aspects agree'}</p>
      )}
      {s.split && s.name && <h3 className='pp-display pp-h3 pp-split__name'>{s.name}</h3>}
      <div className='pp-split__bars'>
        {[a, b].map((v, k) => (
          <div key={k} className='pp-split__bar'>
            <span className='pp-split__label'>
              {trait.aspects[k]} <b>{ord(v)}</b>
            </span>
            <span className='pp-split__track' aria-hidden='true'>
              <span style={{width: `${v}%`, background: trait.color}} />
            </span>
          </div>
        ))}
      </div>
      {s.split ? (
        <>
          <p className='pp-split__gap'>{s.gap} points apart</p>
          {s.note ? <p>{s.note}</p> : <p className='pp-small'>A note on this split is coming soon.</p>}
          <p className='pp-small pp-split__frame'>
            A split isn’t a flaw. It is two real parts of you pulling different ways. Once you can name it, you can stop
            thinking something is wrong with you.
          </p>
        </>
      ) : (
        <p className='pp-small' style={{margin: 0}}>
          Your {trait.aspects[0].toLowerCase()} and {trait.aspects[1].toLowerCase()} sit close together
          {s.gap > 0 ? ` (${s.gap} points apart)` : ''}, so this trait tends to show up in you as one piece.
        </p>
      )}
    </div>
  );
};

/** Save the person's color plate as a shareable image. */
function savePlate(scores: number[]) {
  const c = document.createElement('canvas');
  c.width = 1080;
  c.height = 1350;
  const g = c.getContext('2d');
  if (!g) return;
  g.fillStyle = '#ebeced';
  g.fillRect(0, 0, c.width, c.height);
  const w = scores.map((s) => 0.35 + s / 100);
  const tot = w.reduce((a, b) => a + b, 0);
  let inset = 0;
  const S = 920;
  const X = 80;
  const Y = 110;
  TRAITS.forEach((t, i) => {
    const top = ((inset * 1.25) / 100) * S;
    const side = (inset / 100) * S;
    const bottom = ((inset * 0.75) / 100) * S;
    g.fillStyle = t.color;
    g.fillRect(X + side, Y + top, S - 2 * side, S - top - bottom);
    inset += (w[i] / tot) * 46;
  });
  g.fillStyle = '#15172b';
  g.font = '800 46px Archivo, sans-serif';
  g.fillText('My five colors', X, 1130);
  g.font = '600 30px Archivo, sans-serif';
  g.fillText(TRAITS.map((t, i) => `${t.ocean[0]} ${Math.round(scores[i])}`).join('    '), X, 1188);
  g.fillStyle = '#4a4c60';
  g.font = '500 28px Archivo, sans-serif';
  g.fillText('Personality+ by Patrick Knicely', X, 1250);
  const a = document.createElement('a');
  a.download = 'my-five-colors.png';
  a.href = c.toDataURL('image/png');
  a.click();
}

const ResultsWalk: React.FC<ResultsWalkProps> = ({percentiles, gender, name, share, onDownload, sample}) => {
  const [step, setStep] = useState(0);
  const [pair, setPair] = useState<[number, number]>([0, 2]);
  const [view, setView] = useState<'between' | 'inside'>('between');
  const [insideTrait, setInsideTrait] = useState<number | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const p = (name: string) => percentiles[name] ?? 0;
  const scores = TRAITS.map((t) => p(t.ocean));
  const group = gender === 'male' ? 'men' : gender === 'female' ? 'women' : 'people';

  // Move focus and scroll to the new step's heading (not on first load).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({top: 0});
    headRef.current?.focus();
  }, [step]);

  const go = (i: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, i)));

  const viewSwitch = (
    <div className='pp-switch' role='group' aria-label='Which combinations to show'>
      <button type='button' aria-pressed={view === 'between'} onClick={() => setView('between')}>
        Between traits
      </button>
      <button type='button' aria-pressed={view === 'inside'} onClick={() => setView('inside')}>
        Inside each trait
      </button>
    </div>
  );

  const plate = (focus: number | null) => (
    <ColorPlate
      scores={scores}
      focus={focus}
      onPick={(i) => go(i + 1)}
      label={`Your color plate. ${TRAITS.map((t, i) => `${t.ocean} ${ord(scores[i])} percentile`).join(', ')}.`}
    />
  );

  let body: React.ReactNode;
  if (step === 0) {
    body = (
      <div className='pp-walk__stage'>
        <div className='pp-walk__aside'>
          {plate(null)}
          <p className='pp-small' style={{margin: 0}}>
            Tap a color to open that trait.
          </p>
        </div>
        <div className='pp-walk__read'>
          <h2 ref={headRef} tabIndex={-1} className='pp-display pp-h2'>
            Your five colors
          </h2>
          <p className='pp-lede'>
            Each band is sized by your percentile: where you sit compared with other {group} who took the same test.
          </p>
          <div>
            {TRAITS.map((t, i) => (
              <Scale key={t.ocean} label={t.ocean} value={scores[i]} color={t.color} />
            ))}
          </div>
          <details className='pp-walk__how'>
            <summary>How to read your results</summary>
            <p>
              Every trait and aspect, and where you sit on it, has advantages and disadvantages. That is why the
              variation exists: there is a place for each kind of personality. Much of what goes well in life comes from
              finding the place in relationships, work and commitment that fits how you are built.
            </p>
            <p>
              These results come from your own answers, compared with other {group}. If some descriptions feel harsher
              than seems fair, you may have been harder on yourself than necessary, or answered on a day you were tired,
              unhappy or anxious.
            </p>
          </details>
        </div>
      </div>
    );
  } else if (step <= 5) {
    const i = step - 1;
    const t = TRAITS[i];
    const overview = traitOverviews.find((o) => o.trait === t.ocean);
    const mix = aspectSplit(t.ocean, p(t.aspects[0]), p(t.aspects[1]));
    body = (
      <div className='pp-walk__stage'>
        <div className='pp-walk__aside'>
          {plate(i)}
          <Scale label={t.aspects[0]} value={p(t.aspects[0])} color={t.color} />
          <Scale label={t.aspects[1]} value={p(t.aspects[1])} color={t.color} />
        </div>
        <div className='pp-walk__read'>
          <h2
            ref={headRef}
            tabIndex={-1}
            className='pp-display pp-h1'
            style={{color: t.ocean === 'Conscientiousness' ? undefined : t.color}}>
            {SOFT_NAME[t.ocean] ?? t.ocean}
          </h2>
          <Scale label='Your score' value={scores[i]} color={t.color} big />
          {mix.split && mix.card ? (
            <section className='pp-split is-split pp-mix' aria-label={`Your mix: ${mix.name}`}>
              <p className='pp-split__kicker'>
                Your mix · higher {t.aspects[mix.higher]}, lower {t.aspects[1 - mix.higher]}
              </p>
              <h3 className='pp-display pp-h3 pp-split__name'>{mix.name}</h3>
              <div className='pp-split__bars'>
                {t.aspects.map((a) => (
                  <div key={a} className='pp-split__bar'>
                    <span className='pp-split__label'>
                      {a} <b>{ord(p(a))}</b>
                    </span>
                    <span className='pp-split__track' aria-hidden='true'>
                      <span style={{width: `${p(a)}%`, background: t.color}} />
                    </span>
                  </div>
                ))}
              </div>
              <p className='pp-split__gap'>{mix.gap} points apart</p>
              <div className='pp-walk__text'>
                <Paragraphs trait={t.ocean} score={scores[i]} card={mix.card} />
              </div>
              <p className='pp-small pp-split__frame'>
                A split isn’t a flaw. It is two real parts of you pulling different ways. Once you can name it, you can
                stop thinking something is wrong with you.
              </p>
            </section>
          ) : (
            <>
              <div className='pp-walk__text'>
                <Paragraphs trait={t.ocean} score={scores[i]} />
              </div>
              <SplitCard trait={t} a={p(t.aspects[0])} b={p(t.aspects[1])} />
            </>
          )}
          {t.aspects.map((a) => (
            <section key={a} className='pp-walk__aspect'>
              <h3 className='pp-display pp-h3'>{a}</h3>
              <Scale label='Your score' value={p(a)} color={t.color} />
              <div className='pp-walk__text'>
                <Paragraphs trait={a} score={p(a)} first={false} />
              </div>
            </section>
          ))}
          {overview && (
            <details className='pp-walk__how'>
              <summary>About {t.ocean.toLowerCase()} in general</summary>
              {overview.paragraphs.filter(Boolean).map((para, k) => (
                <p key={k}>{para}</p>
              ))}
            </details>
          )}
        </div>
      </div>
    );
  } else if (step === 6 && view === 'inside') {
    const gaps = TRAITS.map((t) => aspectSplit(t.ocean, p(t.aspects[0]), p(t.aspects[1])));
    const chosen = insideTrait ?? gaps.reduce((best, g, k) => (g.gap > gaps[best].gap ? k : best), 0);
    const t = TRAITS[chosen];
    body = (
      <div className='pp-walk__stage pp-walk__stage--combo'>
        <div>
          <h2 ref={headRef} tabIndex={-1} className='pp-display pp-h2'>
            Inside each trait
          </h2>
          {viewSwitch}
          <p className='pp-lede' style={{margin: '0 0 24px'}}>
            Every trait has two sides. When yours sit far apart, they can pull against each other. Tap a trait to see
            how its two sides line up in you.
          </p>
          <div className='pp-inside' role='group' aria-label='The two sides of each trait'>
            {TRAITS.map((r, k) => (
              <button
                key={r.ocean}
                type='button'
                className='pp-inside__row'
                aria-pressed={chosen === k}
                aria-label={`${r.ocean}: ${r.aspects[0]} ${ord(p(r.aspects[0]))}, ${r.aspects[1]} ${ord(
                  p(r.aspects[1]),
                )}${gaps[k].split ? ', split' : ''}`}
                onClick={() => {
                  setInsideTrait(k);
                  if (window.innerWidth < 900) {
                    window.setTimeout(
                      () => document.getElementById('pp-combo-note')?.scrollIntoView({block: 'nearest'}),
                      50,
                    );
                  }
                }}>
                <span className='pp-inside__name'>{SOFT_NAME[r.ocean] ?? r.ocean}</span>
                <span className='pp-inside__pair' aria-hidden='true'>
                  {[0, 1].map((side) => (
                    <React.Fragment key={side}>
                      <span className='pp-inside__aspect'>{r.aspects[side]}</span>
                      <span className='pp-inside__track'>
                        <span style={{width: `${p(r.aspects[side])}%`, background: r.color}} />
                      </span>
                    </React.Fragment>
                  ))}
                </span>
                <span className={`pp-inside__tag${gaps[k].split ? ' is-split' : ''}`}>
                  {gaps[k].split ? 'Split' : 'Together'}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className='pp-walk__note' id='pp-combo-note' aria-live='polite'>
          <h3 className='pp-display pp-h3'>
            {t.aspects[0]} + {t.aspects[1]}
          </h3>
          <SplitCard trait={t} a={p(t.aspects[0])} b={p(t.aspects[1])} compact />
        </div>
      </div>
    );
  } else if (step === 6) {
    const [a, b] = pair;
    const note = combinationNote(TRAITS[a].ocean, TRAITS[b].ocean, scores[a], scores[b]);
    body = (
      <div className='pp-walk__stage pp-walk__stage--combo'>
        <div>
          <h2 ref={headRef} tabIndex={-1} className='pp-display pp-h2'>
            No trait acts alone
          </h2>
          {viewSwitch}
          <p className='pp-lede' style={{margin: '0 0 24px'}}>
            Every square is a pair. Tap one to see how those two traits play off each other in you.
          </p>
          <div className='pp-matrix' role='group' aria-label='Trait pairs'>
            <span aria-hidden='true' />
            {TRAITS.map((t) => (
              <span key={t.ocean} className='pp-matrix__h' aria-hidden='true'>
                {t.ocean[0]}
              </span>
            ))}
            {TRAITS.map((r, i) => (
              <React.Fragment key={r.ocean}>
                <span className='pp-matrix__rh' aria-hidden='true'>
                  {r.ocean}
                </span>
                {TRAITS.map((c, j) =>
                  j < i ? (
                    <span key={c.ocean} />
                  ) : i === j ? (
                    <span key={c.ocean} className='pp-matrix__self' style={{background: r.color}} aria-hidden='true' />
                  ) : (
                    <button
                      key={c.ocean}
                      type='button'
                      className='pp-matrix__cell'
                      style={{background: `linear-gradient(135deg, ${r.color} 50%, ${c.color} 50%)`}}
                      aria-pressed={a === i && b === j}
                      aria-label={`${r.ocean} with ${c.ocean}`}
                      onClick={() => {
                        setPair([i, j]);
                        if (window.innerWidth < 900) {
                          window.setTimeout(
                            () => document.getElementById('pp-combo-note')?.scrollIntoView({block: 'nearest'}),
                            50,
                          );
                        }
                      }}
                    />
                  ),
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className='pp-walk__note' id='pp-combo-note' aria-live='polite'>
          <h3 className='pp-display pp-h3'>
            {TRAITS[a].ocean} + {TRAITS[b].ocean}
          </h3>
          <Scale label={TRAITS[a].ocean} value={scores[a]} color={TRAITS[a].color} />
          <Scale label={TRAITS[b].ocean} value={scores[b]} color={TRAITS[b].color} />
          {note ? <p>{note}</p> : <p className='pp-small'>A note on how this pair works together is coming soon.</p>}
        </div>
      </div>
    );
  } else {
    body = (
      <div className='pp-walk__stage pp-walk__stage--wide'>
        <div className='pp-walk__read'>
          <h2 ref={headRef} tabIndex={-1} className='pp-display pp-h2'>
            Keep and compare
          </h2>
          <p className='pp-lede'>
            Your whole personality on one page. Download the full report, save your five colors, or compare with someone
            you love.
          </p>
          <figure className='pp-tree-wrap' style={{margin: 0}}>
            <div
              className='pp-tree-scroll'
              ref={(el) => {
                // On narrow screens, open centered on the person's name.
                if (el && !el.dataset.centered) {
                  el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
                  el.dataset.centered = '1';
                }
              }}>
              <PersonalityTree percentiles={percentiles} name={name} />
            </div>
            <p className='pp-small pp-tree-hint'>Swipe sideways to see the whole tree.</p>
            <figcaption className='pp-small'>
              Circle size and the number inside show your percentile. The ring around your name is split by your five
              trait scores. {FACTOR_NAME.stability} averages your Agreeableness, Conscientiousness and low Neuroticism,
              so its purple slice is 100 minus your Neuroticism. {FACTOR_NAME.plasticity} averages your Extraversion and
              Openness.
            </figcaption>
          </figure>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
            <button type='button' className='pp-btn' onClick={onDownload}>
              Download my report (PDF)
            </button>
            <button type='button' className='pp-btn pp-btn--ghost' onClick={() => savePlate(scores)}>
              Save my colors
            </button>
          </div>
          {share}
          <div className='pp-walk__aspect'>
            <h3 className='pp-display pp-h3'>Talk it through</h3>
            <p style={{margin: '0 0 16px'}}>Want to go deeper? Book a results conversation with Patrick.</p>
            <a href={BOOKING_URL} target='_blank' rel='noopener noreferrer' className='pp-btn pp-btn--ghost'>
              {BOOKING_LABEL}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='pp pp-walk'>
      <div className='pp-wrap'>
        <div className='pp-walk__top'>
          <h1 className='pp-display pp-h2'>Your results</h1>
          {sample && <span className='pp-sample-tag'>Sample scores, for preview</span>}
        </div>
        <nav className='pp-walk__steps' aria-label='Results sections'>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s}>
                <button
                  type='button'
                  aria-current={step === i ? 'step' : undefined}
                  style={{'--pp-step': i >= 1 && i <= 5 ? TRAITS[i - 1].color : 'var(--pp-ink)'} as React.CSSProperties}
                  onClick={() => go(i)}>
                  {SOFT_NAME[s] ?? (s === 'Combinations' ? 'Combi\u00ADnations' : s)}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        {body}
        <div className='pp-walk__nav'>
          <button type='button' className='pp-btn pp-btn--ghost' disabled={step === 0} onClick={() => go(step - 1)}>
            Back
          </button>
          {step < STEPS.length - 1 && (
            <button type='button' className='pp-btn' onClick={() => go(step + 1)}>
              Next: {STEPS[step + 1]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsWalk;
