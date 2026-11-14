import React, {useState} from 'react';
import {TRAITS, SOFT_NAME} from './traits';
import {Ocean} from '../constants/schema';
import {motivationFor} from '../constants/giftFinder';
import {ANEW, DISCOVERING, predict, reflectionQuestion, SCENARIOS, SCORES_PAGE, UNIQUE} from '../constants/giftFinderPages';

/** The four opening pages of the Gift Finder, from Patrick's workbook. Sample: answers stay in memory. */

export const ord = (n: number) => {
  const v = Math.round(n);
  const s = v % 100 >= 11 && v % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][v % 10] || 'th';
  return `${v}${s}`;
};

const level = (p: number) => (p >= 60 ? 'higher' : p <= 40 ? 'lower' : 'middle');

export const TextBox: React.FC<{
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}> = ({label, hint, value, onChange, rows = 4}) => {
  const id = React.useRef(`gf-${Math.random().toString(36).slice(2)}`).current;
  return (
    <div className='pp-gf-box'>
      <label htmlFor={id}>{label}</label>
      {hint && <p className='pp-small'>{hint}</p>}
      <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

const Bar: React.FC<{value: number; color: string; thin?: boolean}> = ({value, color, thin}) => (
  <span className={`pp-gf-bar${thin ? ' is-thin' : ''}`} aria-hidden='true'>
    <span style={{width: `${value}%`, background: color}} />
  </span>
);

/* ---------- 1. Discovering personality ---------- */

export const Discovering: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className='pp-gf-flow'>
      <div className='pp-gf-prose'>
        {DISCOVERING.paragraphs.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
      <p className='pp-gf-group'>The five traits · tap one to open it</p>
      <ul className='pp-gf-cards'>
        {TRAITS.map((t, i) => {
          const d = DISCOVERING.traits[t.ocean];
          const on = open === i;
          return (
            <li key={t.ocean} className={on ? 'is-open' : open !== null ? 'is-small' : undefined}>
              <button
                type='button'
                aria-expanded={on}
                style={{'--pp-step': t.color} as React.CSSProperties}
                onClick={() => setOpen(on ? null : i)}>
                <span className='pp-gf-cards__name'>{SOFT_NAME[t.ocean] ?? t.ocean}</span>
                <span className='pp-gf-cards__pair'>{d.pair}</span>
                {on && (
                  <span className='pp-gf-cards__more'>
                    <span>{d.line}</span>
                    <span className='pp-gf-cards__aspects'>
                      Its two aspects: <b>{t.aspects[0]}</b> and <b>{t.aspects[1]}</b>
                    </span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <ol className='pp-gf-how'>
        <li>
          <b>Your scores,</b> already filled in from your test, and what they mean.
        </li>
        <li>
          <b>Reflect</b> on them, and on how your traits drive what you feel, do, think and go after.
        </li>
        <li>
          <b>Gifts and blind spots:</b> pick, rank and write about each.
        </li>
        <li>
          <b>Your tree:</b> it all comes together, from imager of God down to the gifts you carry.
        </li>
      </ol>
    </div>
  );
};

/* ---------- 2. Your scores ---------- */

export const Scores: React.FC<{p: (a: string) => number; name?: string}> = ({p, name}) => {
  const [open, setOpen] = useState<Ocean | null>(TRAITS[0].ocean);
  const [sorted, setSorted] = useState(false);
  const rows = sorted ? [...TRAITS].sort((a, b) => p(b.ocean) - p(a.ocean)) : TRAITS;
  return (
    <div className='pp-gf-flow'>
      <div className='pp-gf-prose'>
        {SCORES_PAGE.paragraphs.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
      <div className='pp-gf-scorebar'>
        <p className='pp-gf-group' style={{margin: 0}}>
          {name ? `${name}’s` : 'Your'} scores · filled in from your test
        </p>
        <div className='pp-switch' role='group' aria-label='Order'>
          <button type='button' aria-pressed={!sorted} onClick={() => setSorted(false)}>
            Test order
          </button>
          <button type='button' aria-pressed={sorted} onClick={() => setSorted(true)}>
            Highest first
          </button>
        </div>
      </div>
      <ul className='pp-gf-scores'>
        {rows.map((t) => {
          const on = open === t.ocean;
          return (
            <li key={t.ocean} className={on ? 'is-open' : undefined} style={{'--pp-step': t.color} as React.CSSProperties}>
              <button type='button' aria-expanded={on} onClick={() => setOpen(on ? null : t.ocean)}>
                <span className='pp-gf-scores__name'>{t.ocean}</span>
                <span className='pp-gf-scores__val'>{ord(p(t.ocean))}</span>
                <Bar value={p(t.ocean)} color={t.color} />
                <span className='pp-gf-scores__chev' aria-hidden='true'>
                  {on ? '−' : '+'}
                </span>
              </button>
              {on && (
                <div className='pp-gf-scores__aspects'>
                  {t.aspects.map((a) => (
                    <div key={a}>
                      <p className='pp-gf-scores__aname'>
                        {a} <b>{ord(p(a))} percentile</b>
                      </p>
                      <Bar value={p(a)} color={t.color} thin />
                      <p className='pp-gf-scores__motive'>{motivationFor(a, p(a))}</p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className='pp-small'>
        Tap a trait to open its two aspects. Each line under an aspect is the strength that tends to come with your
        score.
      </p>
    </div>
  );
};

/* ---------- 3. Discovering yourself anew ---------- */

export const Anew: React.FC<{
  p: (a: string) => number;
  answers: Record<string, string>;
  setAnswer: (k: string, v: string) => void;
}> = ({p, answers, setAnswer}) => {
  const [open, setOpen] = useState(0);
  return (
    <div className='pp-gf-flow'>
      <div className='pp-gf-prose'>
        {ANEW.paragraphs.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
      <ol className='pp-gf-accordion'>
        {TRAITS.map((t, i) => {
          const on = open === i;
          const done = !!answers[t.ocean]?.trim();
          return (
            <li key={t.ocean} className={on ? 'is-open' : undefined} style={{'--pp-step': t.color} as React.CSSProperties}>
              <button type='button' aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                <span className='pp-gf-accordion__n'>{done ? '✓' : i + 1}</span>
                <span className='pp-gf-accordion__name'>{t.ocean}</span>
                <span className='pp-gf-accordion__mini'>
                  {t.aspects.map((a) => (
                    <Bar key={a} value={p(a)} color={t.color} thin />
                  ))}
                </span>
              </button>
              {on && (
                <div className='pp-gf-accordion__body'>
                  <p className='pp-gf-question'>{reflectionQuestion(t.ocean, p)}</p>
                  <TextBox label='Your thoughts' value={answers[t.ocean] ?? ''} onChange={(v) => setAnswer(t.ocean, v)} rows={5} />
                  {i < TRAITS.length - 1 && (
                    <button type='button' className='pp-btn pp-btn--ghost pp-btn--sm' onClick={() => setOpen(i + 1)}>
                      Next: {TRAITS[i + 1].ocean}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

/* ---------- 4. Manifest uniqueness ---------- */

type Fit = 'yes' | 'partly' | 'no';

export const Unique: React.FC<{
  p: (a: string) => number;
  answers: Record<string, string>;
  setAnswer: (k: string, v: string) => void;
}> = ({p, answers, setAnswer}) => {
  const [big, setBig] = useState<string>('a');
  const [fit, setFit] = useState<Record<string, Fit>>({});
  const cur = UNIQUE.abcd.find((x) => x.key === big)!;
  return (
    <div className='pp-gf-flow'>
      <div className='pp-gf-prose'>
        {UNIQUE.paragraphs.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>

      <div className='pp-gf-abcdgrid' role='tablist' aria-label='The ABCDs'>
        {UNIQUE.abcd.map((x) => (
          <button
            key={x.key}
            type='button'
            role='tab'
            aria-selected={big === x.key}
            className={big === x.key ? 'is-big' : undefined}
            onClick={() => setBig(x.key)}>
            <span className='pp-gf-abcdgrid__letter'>{x.letter}</span>
            <span className='pp-gf-abcdgrid__name'>
              {x.name}
              <small>{x.plain}</small>
            </span>
            {answers[`abcd-${x.key}`]?.trim() && <span className='pp-gf-abcdgrid__done'>✓</span>}
          </button>
        ))}
      </div>
      <div className='pp-gf-abcdpanel' role='tabpanel'>
        <p>{cur.body}</p>
        <TextBox label={cur.ask} value={answers[`abcd-${cur.key}`] ?? ''} onChange={(v) => setAnswer(`abcd-${cur.key}`, v)} />
      </div>

      <h2 className='pp-display pp-h3' style={{marginTop: 16}}>
        Five scenarios: what your scores predict
      </h2>
      <p className='pp-small' style={{margin: 0}}>
        Each card shows what people with your scores tend to do. You decide whether it fits.
      </p>
      <ol className='pp-gf-scen'>
        {SCENARIOS.map((s, i) => {
          const lines = predict(s, p);
          const f = fit[s.id];
          return (
            <li key={s.id}>
              <p className='pp-gf-scen__n'>Scenario {i + 1}</p>
              <p className='pp-gf-scen__title'>{s.title}</p>
              <div className='pp-gf-scen__pred'>
                <p className='pp-gf-group' style={{margin: '0 0 6px'}}>
                  Your scores suggest
                </p>
                {lines.length ? (
                  <ul>
                    {lines.map((l) => {
                      const t = TRAITS.find((x) => x.aspects.includes(l.aspect))!;
                      return (
                        <li key={l.aspect} style={{'--pp-step': t.color} as React.CSSProperties}>
                          {l.line}{' '}
                          <span className='pp-gf-scen__why'>
                            ({level(p(l.aspect))} {l.aspect}, {ord(p(l.aspect))})
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p style={{margin: 0}}>Your scores sit near the middle here, so this one could go either way.</p>
                )}
              </div>
              <div className='pp-gf-fit' role='group' aria-label='Sound right?'>
                <span>Sound right?</span>
                {(
                  [
                    ['yes', 'That’s me'],
                    ['partly', 'Partly'],
                    ['no', 'Not really'],
                  ] as [Fit, string][]
                ).map(([k, label]) => (
                  <button key={k} type='button' aria-pressed={f === k} onClick={() => setFit((s0) => ({...s0, [s.id]: k}))}>
                    {label}
                  </button>
                ))}
              </div>
              {f && (
                <TextBox
                  label={f === 'yes' ? 'Tell it in your own words' : 'What would you actually do?'}
                  hint='Think about what you would feel, do, think and want.'
                  value={answers[`scen-${s.id}`] ?? ''}
                  onChange={(v) => setAnswer(`scen-${s.id}`, v)}
                  rows={3}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className='pp-gf-part'>
        <p className='pp-gf-group' style={{margin: 0}}>
          Looking back over the scenarios
        </p>
        {UNIQUE.patterns.map((q, i) => (
          <TextBox key={q} label={q} value={answers[`pattern-${i}`] ?? ''} onChange={(v) => setAnswer(`pattern-${i}`, v)} rows={2} />
        ))}
      </div>
    </div>
  );
};
