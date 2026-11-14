import React, {useEffect, useRef, useState} from 'react';
import {TRAITS, SOFT_NAME} from './traits';
import {Aspect} from '../constants/schema';
import {
  EMPTY_ENTRY,
  Entry,
  fitsScore,
  GIFT_ITEMS,
  GiftItem,
  GiftKind,
  itemById,
  motivationFor,
  PROMPTS,
} from '../constants/giftFinder';
import {IMAGER, UNIQUE, VERSES} from '../constants/giftFinderPages';
import {Anew, Discovering, ord, Scores, TextBox, Unique} from './GiftFinderOpening';
import ImagerTree from './ImagerTree';

/**
 * The Gift Finder walk. Sample version: everything lives in this page's memory.
 * Nothing is saved or sent anywhere.
 */

interface GiftFinderProps {
  percentiles: Record<string, number>;
  name?: string;
  sample?: boolean;
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
          <span>{x.text}</span>
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
          <button type='button' className='pp-gf-keep__btn' aria-label='Keep one fewer' disabled={kept <= 1} onClick={() => setKeep(kept - 1)}>
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
                    {[3, 10, 17].map((cy) => [3, 9].map((cx) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r='1.8' fill='currentColor' />))}
                  </svg>
                </span>
                <span className='pp-gf-row__num'>{i < kept ? i + 1 : ''}</span>
                <span className='pp-gf-row__text'>
                  {x.text}
                  <span className='pp-gf-row__tag'>{x.aspect}</span>
                </span>
                <span className='pp-gf-row__arrows'>
                  <button type='button' aria-label={`Move up: ${x.text}`} disabled={i === 0} onClick={() => move(i, i - 1)}>
                    ↑
                  </button>
                  <button type='button' aria-label={`Move down: ${x.text}`} disabled={i === order.length - 1} onClick={() => move(i, i + 1)}>
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
}> = ({kind, ids, at: rawAt, setAt, p, entries, setEntry}) => {
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
                <span>{itemById(i)!.text}</span>
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

        <p className='pp-small pp-gf-save'>
          Sample only: what you type stays on this page until you reload it. The real version will save privately to
          your account as you type, so you can stop and come back.
        </p>

        <div className='pp-gf-sheet__nav'>
          <button type='button' className='pp-btn pp-btn--ghost pp-btn--sm' disabled={at === 0} onClick={() => goTo(at - 1)}>
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

const Together: React.FC<{gifts: string[]; blinds: string[]; entries: Record<string, Entry>}> = ({gifts, blinds, entries}) => {
  const [g, setG] = useState<string[]>(gifts.slice(0, 3));
  const [b, setB] = useState<string[]>(blinds.slice(0, 2));
  const [use, setUse] = useState<string>(gifts[0] ?? '');
  const [who, setWho] = useState<string>('');

  useEffect(() => {
    setG((s) => (s.length ? s.filter((x) => gifts.includes(x)) : gifts.slice(0, 3)));
    setB((s) => (s.length ? s.filter((x) => blinds.includes(x)) : blinds.slice(0, 2)));
    setUse((u) => (gifts.includes(u) ? u : gifts[0] ?? ''));
  }, [gifts, blinds]);

  const toggle = (list: string[], set: (v: string[]) => void, id: string, max: number) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : list.length >= max ? list : [...list, id]);
  /** "Make friends easily" -> "I make friends easily"; "My mood can change a lot" stays as is. */
  const iPhrase = (text: string) => (/^my /i.test(text) ? `my ${text.slice(3)}` : `I ${text[0].toLowerCase()}${text.slice(1)}`);
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
    <section className='pp-gf-together'>
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
          <input aria-label='Who you will serve' value={who} onChange={(e) => setWho(e.target.value)} placeholder='whom?' />.
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
        <div className='pp-gf-verse pp-gf-verse--slot'>
          <p>
            <span className='pp-gf-draft'>Patrick to choose</span> Verses matched to these gifts will show here, from a
            short list Patrick picks for each trait.
          </p>
        </div>
      )}
    </section>
  );
};

/* ---------- the walk ---------- */

const GiftFinder: React.FC<GiftFinderProps> = ({percentiles, name, sample}) => {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<GiftKind, string[]>>({gift: [], blind: []});
  const [keep, setKeep] = useState<Record<GiftKind, number>>({gift: 7, blind: 7});
  const [writeAt, setWriteAt] = useState<Record<GiftKind, number>>({gift: 0, blind: 0});
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
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

  const go = (i: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
  const toggle = (kind: GiftKind) => (id: string) =>
    setPicked((s) => ({...s, [kind]: s[kind].includes(id) ? s[kind].filter((x) => x !== id) : [...s[kind], id]}));
  const top = (kind: GiftKind) => picked[kind].slice(0, Math.min(keep[kind], picked[kind].length));
  const openWriter = (kind: GiftKind, idx: number) => {
    setWriteAt((s) => ({...s, [kind]: idx}));
    go(STEPS.findIndex((s) => s.kind === kind && s.stage === 'write'));
  };

  const cur = STEPS[step];
  let title = cur.label;
  let lede: React.ReactNode = null;
  let body: React.ReactNode = null;

  if (step === 0) {
    title = 'Discovering personality';
    lede = `${name ? `${name}, this` : 'This'} is your guide to self-understanding.`;
    body = <Discovering />;
  } else if (step === 1) {
    title = 'Understanding your scores';
    body = <Scores p={p} name={name} />;
  } else if (step === 2) {
    body = <Anew p={p} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 3) {
    lede = UNIQUE.abcd.map((x) => x.name).join(' · ');
    body = <Unique p={p} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 4) {
    body = (
      <div className='pp-gf-imager'>
        <div className='pp-gf-prose'>
          {IMAGER.draft && <span className='pp-gf-draft'>Draft · Patrick to write this page</span>}
          {IMAGER.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p className='pp-small'>{IMAGER.verse}</p>
        </div>
        <ImagerTree name={name} p={p} gifts={[]} blinds={[]} entries={entries} seed />
      </div>
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
    body = <Picker key={cur.kind} kind={cur.kind} p={p} picked={picked[cur.kind]} toggle={toggle(cur.kind)} review={review} />;
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
      />
    );
  } else {
    title = 'Your imager tree';
    lede = 'What you have been given, and where you are growing, in your own words.';
    body = (
      <div className='pp-gf-flow'>
        <ImagerTree name={name} p={p} gifts={top('gift')} blinds={top('blind')} entries={entries} onWrite={openWriter} />
        <Together gifts={top('gift')} blinds={top('blind')} entries={entries} />
        <div>
          <button type='button' className='pp-btn' disabled>
            Download as PDF (coming)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='pp pp-walk pp-gf'>
      <div className='pp-wrap'>
        <div className='pp-walk__top'>
          <p className='pp-display pp-h3'>Gift Finder</p>
          {sample && (
            <div className='pp-gf-sampletools'>
              <span className='pp-sample-tag'>Sample scores and draft wording, for preview</span>
              <label className='pp-gf-reviewtoggle'>
                <input type='checkbox' checked={review} onChange={(e) => setReview(e.target.checked)} /> Show where each item
                comes from
              </label>
            </div>
          )}
        </div>
        <nav className='pp-gf-steps' aria-label='Gift Finder sections'>
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

        <div className='pp-gf-stage'>
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
