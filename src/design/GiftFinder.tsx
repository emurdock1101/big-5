import React, {useEffect, useRef, useState} from 'react';
import {TRAITS, SOFT_NAME} from './traits';
import {Aspect} from '../constants/schema';
import {
  EMPTY_ENTRY,
  Entry,
  emptySave,
  GiftFinderSave,
  fitsScore,
  GIFT_ITEMS,
  GiftItem,
  GiftKind,
  itemById,
  motivationFor,
  PARTS,
  partDone,
  PROMPTS,
} from '../constants/giftFinder';
import {IMAGER, UNIQUE, VERSES} from '../constants/giftFinderPages';
import {Anew, Discovering, ord, Scores, TextBox, Unique} from './GiftFinderOpening';
import ImagerTree from './ImagerTree';
import Scene from './Scene';
import Stars from './Stars';

/**
 * The Gift Finder walk. The page that hosts it decides where progress is kept: the real page
 * saves privately to the person's account; the preview keeps it in the browser tab.
 */

interface GiftFinderProps {
  percentiles: Record<string, number>;
  name?: string;
  sample?: boolean;
  /** Where to start (a saved file); empty when new. */
  initial?: GiftFinderSave;
  /** Called after every change with the whole state, for saving. */
  onChange?: (state: GiftFinderSave) => void;
  /** Shown in the band, e.g. "Saved". */
  status?: React.ReactNode;
  /** The line under each writing page about saving. */
  saveNote?: string;
}

type Group = 'you' | 'imager' | 'gift' | 'blind' | 'tree';
type StepDef = {label: string; group: Group; kind?: GiftKind; stage?: 'pick' | 'rank' | 'write'};

const STEPS: StepDef[] = [
  {label: 'Discovering personality', group: 'you'},
  {label: 'Your scores', group: 'you'},
  {label: 'Discovering yourself anew', group: 'you'},
  {label: 'Manifest uniqueness', group: 'you'},
  {label: 'From personality to imager', group: 'imager'},
  {label: 'Gifts: pick', group: 'gift', kind: 'gift', stage: 'pick'},
  {label: 'Gifts: rank', group: 'gift', kind: 'gift', stage: 'rank'},
  {label: 'Gifts: write', group: 'gift', kind: 'gift', stage: 'write'},
  {label: 'Blind spots: pick', group: 'blind', kind: 'blind', stage: 'pick'},
  {label: 'Blind spots: rank', group: 'blind', kind: 'blind', stage: 'rank'},
  {label: 'Blind spots: write', group: 'blind', kind: 'blind', stage: 'write'},
  {label: 'Your tree', group: 'tree'},
];

const GROUP_COLOR: Record<Group, string> = {
  you: 'var(--pp-a)',
  imager: 'var(--pp-ink)',
  gift: 'var(--pp-c)',
  blind: 'var(--pp-n)',
  tree: 'var(--pp-ink)',
};

const NOUN: Record<GiftKind, {one: string; many: string; One: string; Many: string}> = {
  gift: {one: 'gift', many: 'gifts', One: 'Gift', Many: 'Gifts'},
  blind: {one: 'blind spot', many: 'blind spots', One: 'Blind spot', Many: 'Blind spots'},
};

const KEEP_MIN = 6;
const KEEP_MAX = 9;

const traitOf = (aspect: Aspect) => TRAITS.find((t) => t.aspects.includes(aspect))!;

const SOURCE_LABEL = {test: 'Test item', public: 'Public item', draft: 'Our own wording'};

/* ---------- pick ---------- */

const Picker: React.FC<{
  kind: GiftKind;
  p: (a: string) => number;
  picked: string[];
  toggle: (id: string) => void;
  review: boolean;
}> = ({kind, p, picked, toggle, review}) => {
  const [tab, setTab] = useState(0);
  const t = TRAITS[tab];
  const n = NOUN[kind];
  const countIn = (i: number) => picked.filter((id) => TRAITS[i].aspects.includes(itemById(id)!.aspect)).length;

  const items = GIFT_ITEMS.filter((x) => x.kind === kind && t.aspects.includes(x.aspect));
  const fit = items.filter((x) => fitsScore(x, p(x.aspect)));
  const rest = items.filter((x) => !fitsScore(x, p(x.aspect)));

  const tile = (x: GiftItem) => {
    const on = picked.includes(x.id);
    return (
      <li key={x.id}>
        <button
          type='button'
          className='pp-gf-tile'
          aria-pressed={on}
          style={{'--pp-step': t.color} as React.CSSProperties}
          onClick={() => toggle(x.id)}>
          <span className='pp-gf-tile__box' aria-hidden='true'>
            {on ? '✓' : ''}
          </span>
          <span>
            <span className='pp-gf-mark'>{x.text}</span>
          </span>
        </button>
        {review && (
          <div className={`pp-gf-review${x.ask ? ' has-ask' : ''}`}>
            <span>
              {SOURCE_LABEL[x.source]} · {x.aspect}, {x.side} side
            </span>
            {x.ask && <p>{x.ask}</p>}
          </div>
        )}
      </li>
    );
  };

  return (
    <div className='pp-gf-pick'>
      <div className='pp-gf-tabs' role='tablist' aria-label='Traits'>
        {TRAITS.map((tr, i) => (
          <button
            key={tr.ocean}
            type='button'
            role='tab'
            aria-selected={i === tab}
            style={{'--pp-step': tr.color} as React.CSSProperties}
            onClick={() => setTab(i)}>
            <span>{SOFT_NAME[tr.ocean] ?? tr.ocean}</span>
            <span className='pp-gf-tabs__count'>{countIn(i)} picked</span>
          </button>
        ))}
      </div>

      <div className='pp-gf-aspects'>
        {t.aspects.map((a) => (
          <div key={a} className='pp-gf-aspect'>
            <p className='pp-gf-aspect__name'>
              {a} <b>{ord(p(a))} percentile</b>
            </p>
            <p className='pp-gf-aspect__line'>{motivationFor(a, p(a))}</p>
          </div>
        ))}
      </div>

      {fit.length > 0 && (
        <section aria-label={`${n.Many} that fit your scores`}>
          <h3 className='pp-gf-group'>People with your scores often pick these</h3>
          <ul className='pp-gf-tiles'>{fit.map(tile)}</ul>
        </section>
      )}
      <section aria-label={`More ${n.many}`}>
        <h3 className='pp-gf-group'>{fit.length > 0 ? 'More to consider' : `${n.Many} for this trait`}</h3>
        <ul className='pp-gf-tiles'>{rest.map(tile)}</ul>
      </section>

      <div className='pp-gf-pick__foot'>
        <p className='pp-small' style={{margin: 0}}>
          Pick at least 2 here, up to 10. It’s fine to pick generously; you’ll narrow it down next.
        </p>
        {tab < TRAITS.length - 1 && (
          <button type='button' className='pp-btn pp-btn--ghost pp-btn--sm' onClick={() => setTab(tab + 1)}>
            Next trait: {TRAITS[tab + 1].ocean}
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------- rank ---------- */

const Ranker: React.FC<{
  kind: GiftKind;
  order: string[];
  setOrder: (ids: string[]) => void;
  keep: number;
  setKeep: (n: number) => void;
}> = ({kind, order, setOrder, keep, setKeep}) => {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [drag, setDrag] = useState<number | null>(null);
  const [said, setSaid] = useState('');
  const n = NOUN[kind];
  const kept = Math.min(keep, order.length);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setOrder(next);
    setSaid(`${itemById(x)!.text}: moved to ${to + 1} of ${order.length}.`);
  };

  const onMove = (e: React.PointerEvent) => {
    if (drag === null) return;
    const y = e.clientY;
    let target = drag;
    refs.current.forEach((el, j) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (y >= r.top && y <= r.bottom) target = j;
    });
    if (target !== drag) {
      move(drag, target);
      setDrag(target);
    }
  };

  if (order.length === 0) {
    return <p>You haven’t picked any {n.many} yet. Go back a step and tap the ones that sound like you.</p>;
  }

  return (
    <div className='pp-gf-rank'>
      {order.length > KEEP_MIN && (
        <div className='pp-gf-keep'>
          <span>Write about my top</span>
          <button
            type='button'
            className='pp-gf-keep__btn'
            aria-label='Keep one fewer'
            disabled={kept <= 1}
            onClick={() => setKeep(kept - 1)}>
            −
          </button>
          <b aria-live='polite'>{kept}</b>
          <button
            type='button'
            className='pp-gf-keep__btn'
            aria-label='Keep one more'
            disabled={kept >= order.length}
            onClick={() => setKeep(kept + 1)}>
            +
          </button>
          <span className='pp-small'>
            ({KEEP_MIN} to {KEEP_MAX} works well; each one takes about 10 minutes to write)
          </span>
        </div>
      )}
      <ol className='pp-gf-list'>
        {order.map((id, i) => {
          const x = itemById(id)!;
          const t = traitOf(x.aspect);
          return (
            <React.Fragment key={id}>
              {i === kept && (
                <li className='pp-gf-cut' aria-hidden='true'>
                  <span>Set aside for now</span>
                </li>
              )}
              <li
                ref={(el) => (refs.current[i] = el)}
                className={`pp-gf-row${i >= kept ? ' is-out' : ''}${drag === i ? ' is-drag' : ''}`}
                style={{'--pp-step': t.color} as React.CSSProperties}>
                <span
                  className='pp-gf-row__handle'
                  aria-hidden='true'
                  title='Drag to reorder'
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag(i);
                  }}
                  onPointerMove={onMove}
                  onPointerUp={() => setDrag(null)}
                  onPointerCancel={() => setDrag(null)}>
                  <svg viewBox='0 0 12 20' width='12' height='20'>
                    {[3, 10, 17].map((cy) =>
                      [3, 9].map((cx) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r='1.8' fill='currentColor' />),
                    )}
                  </svg>
                </span>
                <span className='pp-gf-row__num'>{i < kept ? i + 1 : ''}</span>
                <span className='pp-gf-row__text'>
                  <span className={`pp-gf-mark${i === 0 ? ' is-on' : ''}`}>{x.text}</span>
                  <span className='pp-gf-row__tag'>{x.aspect}</span>
                </span>
                <span className='pp-gf-row__arrows'>
                  <button
                    type='button'
                    aria-label={`Move up: ${x.text}`}
                    disabled={i === 0}
                    onClick={() => move(i, i - 1)}>
                    ↑
                  </button>
                  <button
                    type='button'
                    aria-label={`Move down: ${x.text}`}
                    disabled={i === order.length - 1}
                    onClick={() => move(i, i + 1)}>
                    ↓
                  </button>
                </span>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
      <p className='pp-visually-hidden' aria-live='polite'>
        {said}
      </p>
    </div>
  );
};

/* ---------- write ---------- */

const Writer: React.FC<{
  kind: GiftKind;
  ids: string[];
  at: number;
  setAt: (i: number) => void;
  p: (a: string) => number;
  entries: Record<string, Entry>;
  setEntry: (id: string, e: Entry) => void;
  saveNote?: string;
}> = ({kind, ids, at: rawAt, setAt, p, entries, setEntry, saveNote}) => {
  const headRef = useRef<HTMLHeadingElement>(null);
  const n = NOUN[kind];
  const pr = PROMPTS[kind];

  if (ids.length === 0) {
    return <p>Pick and rank your {n.many} first, then come back here to write.</p>;
  }

  const at = Math.min(rawAt, ids.length - 1);
  const id = ids[at];
  const x = itemById(id)!;
  const t = traitOf(x.aspect);
  const e = entries[id] ?? EMPTY_ENTRY;
  const set = (k: keyof Entry) => (v: string) => setEntry(id, {...e, [k]: v});
  const done = (i: string) => !!(entries[i]?.story && entries[i]?.forward);
  const goTo = (i: number) => {
    setAt(i);
    window.scrollTo({top: 0});
    setTimeout(() => headRef.current?.focus(), 0);
  };

  return (
    <div className='pp-gf-write'>
      <nav className='pp-gf-queue' aria-label={`Your ${n.many}`}>
        <ol>
          {ids.map((i, k) => (
            <li key={i}>
              <button
                type='button'
                aria-current={k === at ? 'true' : undefined}
                style={{'--pp-step': traitOf(itemById(i)!.aspect).color} as React.CSSProperties}
                onClick={() => goTo(k)}>
                <span className='pp-gf-queue__n'>{done(i) ? '✓' : k + 1}</span>
                <span className='pp-gf-queue__text'>{itemById(i)!.text}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className='pp-gf-sheet' style={{'--pp-step': t.color} as React.CSSProperties}>
        <p className='pp-gf-sheet__kicker'>
          {n.One} {at + 1} of {ids.length} · from your {x.aspect} ({ord(p(x.aspect))} percentile)
        </p>
        <h3 ref={headRef} tabIndex={-1} className='pp-display pp-h3'>
          {x.text}
        </h3>

        <fieldset className='pp-gf-part'>
          <legend>1. {pr.story.title}</legend>
          <TextBox label='The story' hint={pr.story.ask} value={e.story} onChange={set('story')} rows={5} />
          <div className='pp-gf-abcd'>
            {pr.abcd.map((q) => (
              <TextBox key={q.key} label={q.label} hint={q.ask} value={e[q.key]} onChange={set(q.key)} rows={2} />
            ))}
          </div>
        </fieldset>

        <fieldset className='pp-gf-part'>
          <legend>2. {pr.better.title}</legend>
          <TextBox label={pr.better.title} hint={pr.better.ask} value={e.better} onChange={set('better')} />
        </fieldset>

        <fieldset className='pp-gf-part'>
          <legend>3. {pr.forward.title}</legend>
          <TextBox label={pr.forward.title} hint={pr.forward.ask} value={e.forward} onChange={set('forward')} />
        </fieldset>

        <fieldset className='pp-gf-part'>
          <legend>4. {pr.serve.title}</legend>
          <TextBox label={pr.serve.title} hint={pr.serve.ask} value={e.serve} onChange={set('serve')} rows={3} />
        </fieldset>

        {saveNote && <p className='pp-small pp-gf-save'>{saveNote}</p>}

        <div className='pp-gf-sheet__nav'>
          <button
            type='button'
            className='pp-btn pp-btn--ghost pp-btn--sm'
            disabled={at === 0}
            onClick={() => goTo(at - 1)}>
            Previous {n.one}
          </button>
          {at < ids.length - 1 && (
            <button type='button' className='pp-btn pp-btn--sm' onClick={() => goTo(at + 1)}>
              Next {n.one}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- putting it together ---------- */

const Together: React.FC<{
  gifts: string[];
  blinds: string[];
  entries: Record<string, Entry>;
  answers: Record<string, string>;
  setAnswer: (k: string, v: string) => void;
  /** Preview only: show the empty verse slot as a reminder. Real buyers see nothing until verses exist. */
  sample?: boolean;
}> = ({gifts, blinds, entries, answers, setAnswer, sample}) => {
  // Choices are kept with the other answers so they are saved; until chosen, the top ranked ones show.
  const listOf = (key: string, from: string[], n: number) => {
    const saved = answers[key];
    return saved === undefined ? from.slice(0, n) : saved.split(',').filter((x) => from.includes(x));
  };
  const g = listOf('together-gifts', gifts, 3);
  const b = listOf('together-blinds', blinds, 2);
  const setG = (v: string[]) => setAnswer('together-gifts', v.join(','));
  const setB = (v: string[]) => setAnswer('together-blinds', v.join(','));
  const use = gifts.includes(answers['together-use']) ? answers['together-use'] : (gifts[0] ?? '');
  const setUse = (v: string) => setAnswer('together-use', v);
  const who = answers['together-who'] ?? '';
  const setWho = (v: string) => setAnswer('together-who', v);

  const toggle = (list: string[], set: (v: string[]) => void, id: string, max: number) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : list.length >= max ? list : [...list, id]);
  /** "Make friends easily" -> "I make friends easily"; "My mood can change a lot" stays as is. */
  const iPhrase = (text: string) =>
    /^my /i.test(text) ? `my ${text.slice(3)}` : `I ${text[0].toLowerCase()}${text.slice(1)}`;
  const words = (ids: string[]) => {
    const t = ids.map((id) => iPhrase(itemById(id)!.text));
    return t.length <= 1 ? t.join('') : `${t.slice(0, -1).join(', ')} and ${t[t.length - 1]}`;
  };
  const serveHint = use ? entries[use]?.serve : '';
  // Verses for the traits behind the chosen gifts, no repeats, at most three.
  const verses = Array.from(new Set(g.map((id) => traitOf(itemById(id)!.aspect).ocean)))
    .flatMap((o) => VERSES[o])
    .slice(0, 3);

  if (!gifts.length) return null;

  return (
    // The ending sits in the dawn scene, as the homepage closes.
    <section className='pp-gf-together pp-gf-room pp-gf-room--dawn'>
      <Scene
        kind='ridges'
        className='pp-scene--dawn pp-scene--gfdawn'
        sun={TRAITS[0].color}
        sunX={1060}
        sunY={210}
        sunFront
        engraved
      />
      <h2 className='pp-display pp-h3'>Putting it together</h2>
      <p className='pp-small' style={{margin: 0}}>
        Tap to choose which gifts (up to 3) and blind spots (up to 2) go into your statement.
      </p>
      <div className='pp-gf-chips' role='group' aria-label='Gifts in your statement'>
        {gifts.map((id) => (
          <button
            key={id}
            type='button'
            aria-pressed={g.includes(id)}
            style={{'--pp-step': traitOf(itemById(id)!.aspect).color} as React.CSSProperties}
            onClick={() => toggle(g, setG, id, 3)}>
            {itemById(id)!.text}
          </button>
        ))}
      </div>
      {blinds.length > 0 && (
        <div className='pp-gf-chips' role='group' aria-label='Blind spots in your statement'>
          {blinds.map((id) => (
            <button
              key={id}
              type='button'
              aria-pressed={b.includes(id)}
              style={{'--pp-step': traitOf(itemById(id)!.aspect).color} as React.CSSProperties}
              onClick={() => toggle(b, setB, id, 2)}>
              {itemById(id)!.text}
            </button>
          ))}
        </div>
      )}

      <blockquote className='pp-gf-statement'>
        <p>I was made to image God.</p>
        {g.length > 0 && <p>Among the gifts he gave me: {words(g)}.</p>}
        {b.length > 0 && <p>He is still at work where {words(b)}.</p>}
        <p>
          This week I will use this gift:{' '}
          <select aria-label='Which gift' value={use} onChange={(e) => setUse(e.target.value)}>
            {gifts.map((id) => (
              <option key={id} value={id}>
                {itemById(id)!.text}
              </option>
            ))}
          </select>{' '}
          <br />
          to serve{' '}
          <input
            aria-label='Who you will serve'
            value={who}
            onChange={(e) => setWho(e.target.value)}
            placeholder='whom?'
          />
          .
        </p>
      </blockquote>
      {serveHint && <p className='pp-small'>You wrote that this gift could serve: {serveHint}</p>}

      {verses.length > 0 ? (
        <div className='pp-gf-verse'>
          {verses.map((v) => (
            <p key={v.ref}>
              {v.text && <>{v.text} </>}
              <cite>{v.ref}</cite>
            </p>
          ))}
        </div>
      ) : (
        sample && (
          <div className='pp-gf-verse pp-gf-verse--slot'>
            <p>
              <span className='pp-gf-draft'>Patrick to choose</span> Verses matched to these gifts will show here, from
              a short list Patrick picks for each trait.
            </p>
          </div>
        )
      )}
    </section>
  );
};

/* ---------- the walk ---------- */

const GiftFinder: React.FC<GiftFinderProps> = ({percentiles, name, sample, initial, onChange, status, saveNote}) => {
  const [start] = useState(() => initial ?? emptySave());
  const [step, setStep] = useState(Math.min(start.step, STEPS.length - 1));
  const [picked, setPicked] = useState<Record<GiftKind, string[]>>(start.picked);
  const [keep, setKeep] = useState<Record<GiftKind, number>>(start.keep);
  const [writeAt, setWriteAt] = useState<Record<GiftKind, number>>(start.writeAt);
  const [entries, setEntries] = useState<Record<string, Entry>>(start.entries);
  const [answers, setAnswers] = useState<Record<string, string>>(start.answers);
  const loaded = useRef(true);

  // Hand every change to the host page for saving (not the first render: nothing has changed yet).
  useEffect(() => {
    if (loaded.current) {
      loaded.current = false;
      return;
    }
    onChange?.({v: 1, step, picked, keep, writeAt, entries, answers});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, picked, keep, writeAt, entries, answers]);
  const [review, setReview] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const p = (a: string) => percentiles[a] ?? 50;
  const setAnswer = (k: string, v: string) => setAnswers((s) => ({...s, [k]: v}));

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({top: 0});
    headRef.current?.focus();
  }, [step]);

  const go = (i: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
    setStepsOpen(false);
  };
  const toggle = (kind: GiftKind) => (id: string) =>
    setPicked((s) => ({...s, [kind]: s[kind].includes(id) ? s[kind].filter((x) => x !== id) : [...s[kind], id]}));
  const top = (kind: GiftKind) => picked[kind].slice(0, Math.min(keep[kind], picked[kind].length));
  const openWriter = (kind: GiftKind, idx: number) => {
    setWriteAt((s) => ({...s, [kind]: idx}));
    go(STEPS.findIndex((s) => s.kind === kind && s.stage === 'write'));
  };

  const cur = STEPS[step];
  // The journey shows in the band: the sun climbs and the sky warms from night to dawn, step by step,
  // and every piece of writing lights one star.
  const far = step / (STEPS.length - 1);
  const written =
    Object.entries(answers).filter(([k, v]) => !/^(fit-|together-)/.test(k) && v.trim()).length +
    Object.values(entries).reduce((n, e) => n + PARTS.filter((part) => partDone(e, part)).length, 0);
  let title = cur.label;
  let lede: React.ReactNode = null;
  let body: React.ReactNode = null;

  if (step === 0) {
    title = 'Discovering personality';
    lede = `${name ? `${name}, this` : 'This'} is your guide to self-understanding.`;
    body = <Discovering p={p} />;
  } else if (step === 1) {
    title = 'Understanding your scores';
    body = <Scores p={p} name={name} />;
  } else if (step === 2) {
    body = <Anew p={p} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 3) {
    lede = UNIQUE.abcd.map((x) => x.name).join(' · ');
    body = <Unique p={p} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 4) {
    // A night room: the move from personality to imager is a threshold, like the site's dark openings.
    body = (
      <section className='pp-gf-room pp-gf-room--night'>
        <Scene
          kind='ridges'
          className='pp-scene--gfroom'
          sun={TRAITS[0].color}
          sunX={1180}
          sunY={150}
          sunFront
          engraved
        />
        <div className='pp-gf-imager'>
          <div className='pp-gf-prose'>
            {sample && IMAGER.draft && <span className='pp-gf-draft'>Draft · Patrick to write this page</span>}
            {IMAGER.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
            <p className='pp-small'>{IMAGER.verse}</p>
          </div>
          <ImagerTree name={name} p={p} gifts={[]} blinds={[]} entries={entries} seed sample={sample} />
        </div>
      </section>
    );
  } else if (cur.kind && cur.stage === 'pick') {
    const n = NOUN[cur.kind];
    title = cur.kind === 'gift' ? 'Pick your gifts' : 'Pick your blind spots';
    lede = (
      <>
        {cur.kind === 'gift'
          ? 'Go trait by trait and tap what sounds like you on a good day.'
          : 'Be honest, not harsh. Tap what sounds like you on a hard day. No score is bad; every trait has its costs.'}{' '}
        <span className='pp-gf-total'>
          {picked[cur.kind].length} {picked[cur.kind].length === 1 ? n.one : n.many} picked
        </span>
      </>
    );
    body = (
      <Picker
        key={cur.kind}
        kind={cur.kind}
        p={p}
        picked={picked[cur.kind]}
        toggle={toggle(cur.kind)}
        review={review}
      />
    );
  } else if (cur.kind && cur.stage === 'rank') {
    const kind = cur.kind;
    title = kind === 'gift' ? 'Which gifts matter most?' : 'Which blind spots cost you most?';
    lede = 'Drag to put them in order, or use the arrows. The ones above the line are the ones you’ll write about.';
    body = (
      <Ranker
        kind={kind}
        order={picked[kind]}
        setOrder={(ids) => setPicked((s) => ({...s, [kind]: ids}))}
        keep={keep[kind]}
        setKeep={(k) => setKeep((s) => ({...s, [kind]: k}))}
      />
    );
  } else if (cur.kind && cur.stage === 'write') {
    const kind = cur.kind;
    title = kind === 'gift' ? 'Write about your gifts' : 'Write about your blind spots';
    lede = 'One at a time. About ten minutes each. Short answers are fine; honest ones are better.';
    body = (
      <Writer
        kind={kind}
        ids={top(kind)}
        at={writeAt[kind]}
        setAt={(i) => setWriteAt((s) => ({...s, [kind]: i}))}
        p={p}
        entries={entries}
        setEntry={(id, e) => setEntries((s) => ({...s, [id]: e}))}
        saveNote={saveNote}
      />
    );
  } else {
    title = 'Your imager tree';
    lede = 'What you have been given, and where you are growing, in your own words.';
    body = (
      <div className='pp-gf-flow'>
        <ImagerTree
          name={name}
          p={p}
          gifts={top('gift')}
          blinds={top('blind')}
          entries={entries}
          onWrite={openWriter}
          sample={sample}
        />
        <Together
          gifts={top('gift')}
          blinds={top('blind')}
          entries={entries}
          answers={answers}
          setAnswer={setAnswer}
          sample={sample}
        />
        <div>
          <button type='button' className='pp-btn' disabled>
            Download as PDF (coming)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='pp pp-walk pp-walk--cine pp-gf'>
      {/* the opening band: night sky, red sun and mountains behind the title and steps (as on results) */}
      <header
        className='pp-walk__band'
        style={{'--pp-rise': Math.round(80 * (1 - far)), '--gf-dawn': Math.pow(far, 1.6).toFixed(3)} as React.CSSProperties}>
        <Stars count={Math.min(written, 120)} seed={12} className='pp-stars--band' appear />
        <Scene kind='ridges' className='pp-scene--walk' sun={TRAITS[0].color} sunX={1110} sunY={175} sunFront />
        <div className='pp-wrap'>
          <div className='pp-walk__top'>
            <p className='pp-display pp-h2'>Gift Finder</p>
            {status && <div className='pp-gf-status'>{status}</div>}
            {sample && (
              <div className='pp-gf-sampletools'>
                <span className='pp-sample-tag'>Sample scores and draft wording, for preview</span>
                <label className='pp-gf-reviewtoggle'>
                  <input type='checkbox' checked={review} onChange={(e) => setReview(e.target.checked)} /> Show where
                  each item comes from
                </label>
              </div>
            )}
          </div>
          <nav
            className={`pp-gf-steps${step > 0 && !stepsOpen ? ' is-folded' : ''}`}
            aria-label='Gift Finder sections'>
            {/* phones: after the first step the twelve tabs fold into one line; tap it for the full list */}
            {step > 0 && (
              <button
                type='button'
                className='pp-gf-steps__sum'
                aria-expanded={stepsOpen}
                onClick={() => setStepsOpen(!stepsOpen)}>
                <span>
                  Step {step + 1} of {STEPS.length}
                </span>
                <b>{cur.label}</b>
                <span className='pp-gf-steps__chev' aria-hidden='true'>
                  {stepsOpen ? '−' : '+'}
                </span>
                <span className='pp-gf-steps__line' aria-hidden='true'>
                  <span style={{width: `${((step + 1) / STEPS.length) * 100}%`}} />
                </span>
              </button>
            )}
            <ol>
              {STEPS.map((s, i) => (
                <li key={s.label}>
                  <button
                    type='button'
                    aria-current={step === i ? 'step' : undefined}
                    style={{'--pp-step': GROUP_COLOR[s.group]} as React.CSSProperties}
                    onClick={() => go(i)}>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      <div className='pp-wrap'>
        <div key={step} className='pp-gf-stage pp-walk__swap'>
          <header className='pp-gf-head'>
            <h1 ref={headRef} tabIndex={-1} className='pp-display pp-h2'>
              {title}
            </h1>
            {lede && <p className='pp-lede pp-gf-lede'>{lede}</p>}
          </header>
          {body}
        </div>

        <div className='pp-walk__nav'>
          <button type='button' className='pp-btn pp-btn--ghost' disabled={step === 0} onClick={() => go(step - 1)}>
            Back
          </button>
          {step < STEPS.length - 1 && (
            <button type='button' className='pp-btn' onClick={() => go(step + 1)}>
              Next: {STEPS[step + 1].label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftFinder;
