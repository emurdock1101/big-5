import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import ColorPlate from '../design/ColorPlate';
import Strip from '../design/Strip';
import Threads, {ColorWheel} from '../design/Threads';
import Scene from '../design/Scene';
import {BOOKING_LABEL, BOOKING_URL, PRICE, TRAITS} from '../design/traits';
import {interpretations} from '../constants/interpretations';
import patrick from '../images/patrick.jpeg';
import '../design/flow.css';

/*
 * The homepage. variant 'cinematic' (the live look, Nov 2026): night grounds, drawn landscapes,
 * the thread slider, scroll reveals. variant 'flow' is the earlier light sample, kept on the
 * development-only /home-flow-preview page for comparison.
 */

interface HomeProps {
  loggedIn: boolean;
  completed: boolean;
  /** 'cinematic' is the dark variant (sample only): night grounds and drawn landscapes. */
  variant?: 'flow' | 'cinematic';
}

// Illustrative scores for the sample report. Not anyone's real results.
const SAMPLE = {
  scores: [72, 31, 64, 48, 85],
  aspects: [
    [68, 74],
    [36, 27],
    [70, 57],
    [44, 52],
    [88, 79],
  ],
};

const sampleExcerpt =
  interpretations.find((i) => i.trait === 'Openness' && i.scoreLevel === 'high')?.paragraphs[0] ??
  interpretations[0].paragraphs[0];

const [E, N, A, C, O] = TRAITS.map((t) => t.color);

/** A thick, squared marker stroke that draws itself under existing words. */
const Mark: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
  <mark className='pp-mark' data-reveal='mark' style={{'--mk': color} as React.CSSProperties}>
    {children}
  </mark>
);

/** Architect-style hand-lettered margin note, set on a line that already exists on the page. */
const Note: React.FC<{color?: string; arrow?: 'up' | 'down' | 'none'; className?: string; children: React.ReactNode}> = ({
  color,
  arrow = 'none',
  className,
  children,
}) => (
  <span
    className={`pp-note pp-note--${arrow}${className ? ' ' + className : ''}`}
    data-reveal='note'
    style={color ? ({'--nt': color} as React.CSSProperties) : undefined}>
    <span className='pp-note__text'>{children}</span>
    {arrow !== 'none' && (
      <svg className='pp-note__arrow' viewBox='0 0 64 48' aria-hidden='true'>
        {arrow === 'down' && <path pathLength={100} d='M6 8 H40 V40 M30 30 L40 42 L50 30' />}
        {arrow === 'up' && <path pathLength={100} d='M6 40 H40 V8 M30 18 L40 6 L50 18' />}
      </svg>
    )}
  </span>
);

/** A trait-color square that sits on the seam between two rooms, on the quest line. */
const Waypoint: React.FC<{color: string}> = ({color}) => (
  <span className='pp-waypoint' data-reveal='waypoint' style={{background: color}} aria-hidden='true' />
);

const HomeCinematic: React.FC<HomeProps> = (props: HomeProps) => {
  const cine = props.variant === 'cinematic';
  const [guess, setGuess] = useState<number[]>([50, 50, 50, 50, 50]);
  const [active, setActive] = useState<number | null>(null);
  const [touched, setTouched] = useState<number | null>(null);
  const [open, setOpen] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [showDock, setShowDock] = useState(false);
  const heroActions = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [motion] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // The hand-lettering face, loaded only for this sample.
  useEffect(() => {
    const id = 'pp-flow-font';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap';
    document.head.appendChild(link);
  }, []);

  // Scroll reveals: each [data-reveal] element is marked once it enters the view.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!motion || !('IntersectionObserver' in window)) {
      targets.forEach((t) => (t.dataset.in = 'true'));
      return;
    }
    // Hidden wipes and waypoints have no visible area, so they are watched through their parent.
    const watch = new Map<Element, HTMLElement[]>();
    targets.forEach((t) => {
      const kind = t.dataset.reveal;
      const key = (kind === 'wipe' || kind === 'waypoint') && t.parentElement ? t.parentElement : t;
      watch.set(key, [...(watch.get(key) ?? []), t]);
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (watch.get(e.target) ?? []).forEach((t) => (t.dataset.in = 'true'));
          io.unobserve(e.target);
        }),
      {rootMargin: '0px 0px -12% 0px', threshold: 0}
    );
    watch.forEach((_, key) => io.observe(key));
    return () => io.disconnect();
  }, [motion]);

  // The quest line and the top progress bar follow the scroll.
  useEffect(() => {
    const el = root.current;
    if (!el || !motion) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const line = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      const page = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      el.style.setProperty('--pp-line', line.toFixed(4));
      el.style.setProperty('--pp-page', page.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [motion]);

  // Show the phone's bottom action only once the hero button has scrolled away
  // and no other inline primary action is on screen.
  useEffect(() => {
    const hero = heroActions.current;
    if (!hero || !('IntersectionObserver' in window)) return;
    const ctas = Array.from(document.querySelectorAll('.pp-hero ~ section [data-cta]'));
    const visible = new Set<Element>();
    let pastHero = false;
    const update = () => setShowDock(pastHero && visible.size === 0);
    const heroIo = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    const ctaIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      update();
    });
    heroIo.observe(hero);
    ctas.forEach((c) => ctaIo.observe(c));
    return () => {
      heroIo.disconnect();
      ctaIo.disconnect();
    };
  }, []);

  const clearSession = () => {
    if (sessionStorage.length > 0) sessionStorage.clear();
  };

  const primary = !props.loggedIn
    ? {to: '/buy', label: `Take the test — ${PRICE}`}
    : props.completed
    ? {to: '/results', label: 'View your results'}
    : {to: '/test', label: 'Take the test'};

  const setOne = (i: number, v: number) => {
    setGuess((g) => g.map((x, j) => (j === i ? v : x)));
    setActive(i);
    setTouched(i);
  };

  const hint =
    touched === null
      ? 'Each band grows with its trait. The test replaces your guess with a measurement.'
      : `${TRAITS[touched].ocean}: ${guess[touched] < 50 ? TRAITS[touched].low : TRAITS[touched].high}.`;

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % 5 : e.key === 'ArrowLeft' ? (i + 4) % 5 : null;
    if (next === null) return;
    e.preventDefault();
    setOpen(next);
    tabRefs.current[next]?.focus();
  };

  const t = TRAITS[open];

  return (
    <div className={`pp pp-flow${motion ? ' pp-flow--motion' : ''}${cine ? ' pp-flow--cinematic' : ''}`} ref={root}>
      {/* progress along the page, under the sticky header */}
      <div className='pp-flow__progress' aria-hidden='true'>
        <Strip />
      </div>
      {/* the quest line: the five-color strip threading down the page */}
      <div className='pp-flow__line' aria-hidden='true'>
        <Strip />
      </div>

      {/* ---------- first viewport: the sampler ---------- */}
      <section className={`pp-hero${cine ? ' pp-room pp-room--night pp-field' : ''}`}>
        {cine && <Scene kind='ridges' className='pp-scene--hero' sun={E} sunX={640} sunY={95} />}
        <div className='pp-wrap pp-hero__grid pp-hero__grid--sampler'>
          <div className='pp-hero__copy'>
            <p className='pp-verse' data-reveal='rise'>
              You are His workmanship. Made for good works. <cite>Ephesians 2:10</cite>
            </p>
            <h1 className='pp-display pp-h1' data-reveal='wipe'>
              Find out <Mark color={E}>how God made you</Mark>. Then find out <Mark color={C}>what for</Mark>.
            </h1>
            <p className='pp-lede' data-reveal='rise'>
              A 100-question Big Five personality test from Patrick Knicely, LPC: personality researcher and
              biblical scholar.
            </p>
            <div className='pp-hero__actions' ref={heroActions} data-reveal='rise'>
              <Link to={primary.to} className='pp-btn pp-flow-btn' data-cta onClick={clearSession}>
                {primary.label}
              </Link>
              <Link to='/#report' className='pp-textlink'>
                See a sample report
              </Link>
            </div>
            <ul className='pp-hero__facts' data-reveal='rise'>
              <li>100 questions</li>
              <li>10–20 minutes</li>
              <li>Results to keep and download</li>
            </ul>
          </div>

          <div className='pp-sampler'>
            {cine ? (
              <div className='pp-flow__threadswrap' data-reveal='rise'>
                <Threads
                  scores={guess}
                  focus={active}
                  motion={motion}
                  label={`Your guessed threads: ${TRAITS.map((tr, i) => `${tr.ocean} ${guess[i]}`).join(', ')}.`}
                />
              </div>
            ) : (
              <div className='pp-flow__platewrap' data-reveal='plate'>
                <ColorPlate
                  scores={guess}
                  focus={active}
                  label={`Your guessed color plate: ${TRAITS.map((tr, i) => `${tr.ocean} ${guess[i]}`).join(', ')}.`}
                />
              </div>
            )}
            <div className='pp-sampler__head'>
              <h2 className='pp-sampler__title'>Move the sliders. Guess your mix.</h2>
              <Note color={cine ? E : 'var(--pp-e-ink)'} arrow='up' className='pp-note--plate'>
                Preview, not a result
              </Note>
            </div>
            <ul className='pp-sliders' data-reveal='bars'>
              {TRAITS.map((tr, i) => (
                <li key={tr.ocean}>
                  <label htmlFor={`guess-${i}`}>
                    <span className='pp-chip' style={{background: tr.color}} aria-hidden='true' />
                    {tr.ocean}
                  </label>
                  <input
                    id={`guess-${i}`}
                    type='range'
                    min={0}
                    max={100}
                    value={guess[i]}
                    style={{'--pp-track': tr.color} as React.CSSProperties}
                    aria-valuetext={`${guess[i]}: ${guess[i] < 50 ? tr.low : tr.high}`}
                    onChange={(e) => setOne(i, +e.target.value)}
                    onPointerUp={() => setActive(null)}
                    onKeyUp={() => setActive(null)}
                    onBlur={() => setActive(null)}
                  />
                  <output htmlFor={`guess-${i}`}>{guess[i]}</output>
                </li>
              ))}
            </ul>
            <p className='pp-small pp-sampler__hint' aria-live='polite'>
              {hint}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- a moving band of the five traits (decorative; the names are all below) ---------- */}
      <div className='pp-flow__band' aria-hidden='true'>
        <div className='pp-flow__track'>
          {[0, 1].map((copy) =>
            TRAITS.map((tr) => (
              <span
                key={`${copy}-${tr.ocean}`}
                className='pp-flow__card'
                style={{background: tr.color, '--pp-card': tr.color} as React.CSSProperties}>
                {cine && <Scene kind='ridges' className='pp-scene--card' sun={tr.color} sunX={1000} sunY={170} />}
                <span className='pp-flow__cardname'>{tr.ocean}</span>
                <span className='pp-flow__cardaspects'>
                  {tr.aspects[0]} · {tr.aspects[1]}
                </span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ---------- why: the faith side (a cinematic room) ---------- */}
      <section id='why' className={`pp-section pp-field pp-room ${cine ? 'pp-room--black' : 'pp-room--night'}`}>
        <Waypoint color={E} />
        {cine ? (
          <Scene kind='waves' className='pp-scene--sea' />
        ) : (
          <div className='pp-room__squares' aria-hidden='true'>
            <span />
            <span />
            <span />
          </div>
        )}
        <div className='pp-wrap pp-why'>
          <div>
            <ul className='pp-why__qs'>
              <li data-reveal='rise'>Why do you think the way you do?</li>
              <li data-reveal='rise'>Why does the work you were made for feel so far from the work you settled for?</li>
              <li data-reveal='rise'>And what if who you are and what God made you for were never at odds?</li>
            </ul>
            <p className='pp-display pp-why__land' data-reveal='wipe'>
              Know how you’re made. <Mark color={E}>Live what you’re made for.</Mark>
            </p>
          </div>
          <div className='pp-why__side' data-reveal='rise'>
            <p>
              Personality science tells you how you’re built. The Bible’s bigger story tells you why it matters: you were
              made as one of God’s imagers, to represent Him with the temperament you actually have, not the one someone
              told you to want.
            </p>
            <p>
              People are built differently.{' '}
              <Note color={C} className='pp-note--block'>
                One size never fits all.
              </Note>
            </p>
            <Link to='/about' className='pp-textlink'>
              About Patrick
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- trait explorer ---------- */}
      <section id='traits' className='pp-section pp-room'>
        <Waypoint color={N} />
        <div className='pp-wrap'>
          <div className='pp-section-head pp-flow__head--offset'>
            <h2 className='pp-display pp-h2 pp-flow__h2xl' data-reveal='wipe'>
              Five traits. Ten aspects. <Mark color={A}>Open each one.</Mark>
            </h2>
            <div className='pp-flow__lede-pair' data-reveal='rise'>
              <Note color='var(--pp-a-ink)' arrow='down'>
                None is good or bad on its own.
              </Note>
              <p className='pp-lede' style={{maxWidth: '54ch'}}>
                What matters is your mix, and what you do with it.
              </p>
            </div>
          </div>
          <div className='pp-explorer'>
            <div className='pp-explorer__tabs' role='tablist' aria-label='The five traits' data-reveal='bars'>
              {TRAITS.map((tr, i) => (
                <button
                  key={tr.ocean}
                  ref={(el) => (tabRefs.current[i] = el)}
                  type='button'
                  role='tab'
                  id={`trait-tab-${i}`}
                  aria-selected={open === i}
                  aria-controls='trait-panel'
                  tabIndex={open === i ? 0 : -1}
                  className='pp-explorer__tab'
                  style={{background: tr.color}}
                  onClick={() => setOpen(i)}
                  onKeyDown={(e) => onTabKey(e, i)}>
                  <span className='pp-explorer__tabname'>{tr.ocean}</span>
                  <span className='pp-explorer__tabshort' aria-hidden='true'>
                    {tr.ocean[0]}
                  </span>
                </button>
              ))}
            </div>
            <div
              className='pp-explorer__panel'
              role='tabpanel'
              id='trait-panel'
              aria-labelledby={`trait-tab-${open}`}
              style={{'--pp-panel': t.color} as React.CSSProperties}
              data-reveal='rise'>
              <div key={open} className='pp-flow__swap'>
                <h3 className='pp-display pp-h2'>{t.ocean}</h3>
                <p className='pp-trait__aspects' style={{margin: 0}}>
                  {t.aspects[0]} · {t.aspects[1]}
                </p>
                <p className='pp-lede' style={{maxWidth: '46ch'}}>
                  {t.line}
                </p>
                <dl className='pp-explorer__ends'>
                  <div>
                    <dt>Lower scores</dt>
                    <dd>{t.low}.</dd>
                  </div>
                  <div>
                    <dt>Higher scores</dt>
                    <dd>{t.high}.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- how it works (a solid trait-color room) ---------- */}
      <section id='how' className={`pp-section pp-room ${cine ? 'pp-room--night pp-field' : 'pp-room--teal'}`}>
        <Waypoint color={A} />
        <div className='pp-wrap'>
          <div className='pp-section-head'>
            <h2 className='pp-display pp-h2 pp-flow__h2xl' data-reveal='wipe'>
              How it works
            </h2>
          </div>
          <ol className='pp-steps pp-flow__stairs'>
            <li data-reveal='rise'>
              <span className='pp-steps__n'>1</span>
              <h3 className='pp-display pp-h3'>Buy the test</h3>
              <p style={{margin: 0}}>
                {PRICE}, paid securely through Stripe. You create your account right after checkout. One purchase is one
                test, so use a new email for each person.
              </p>
            </li>
            <li data-reveal='rise'>
              <span className='pp-steps__n'>2</span>
              <h3 className='pp-display pp-h3'>Answer 100 questions</h3>
              <p style={{margin: 0}}>
                Takes 10–20 minutes. Pick a quiet moment when you are rested; you take it once, so your answers stay
                honest.
              </p>
            </li>
            <li data-reveal='rise'>
              <span className='pp-steps__n'>3</span>
              <h3 className='pp-display pp-h3'>Read your report</h3>
              <p style={{margin: 0}}>
                A percentile for each of the five traits and ten aspects, with paragraphs on how they shape your
                emotions, behavior, thinking and motivation. View it anytime or download it.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------- sample report ---------- */}
      <section id='report' className='pp-section pp-room pp-room--deep'>
        <Waypoint color={O} />
        <div className='pp-wrap pp-report pp-flow__report'>
          <div className='pp-flow__report-copy' style={{display: 'grid', gap: 24}}>
            <h2 className='pp-display pp-h2' data-reveal='wipe'>
              What your report shows
            </h2>
            <p className='pp-lede' data-reveal='rise'>
              Where you sit on each trait and aspect compared with other people, and what that means in plain language.
            </p>
            <ul className='pp-hero__facts pp-flow__ticks' data-reveal='rise'>
              <li>Percentiles for 5 traits and 10 aspects</li>
              <li>Written interpretation for every trait</li>
              <li>Strengths and areas to grow</li>
              <li>Saved to your account, downloadable</li>
            </ul>
            <div data-reveal='rise'>
              <Link to={primary.to} className='pp-btn pp-flow-btn' data-cta onClick={clearSession}>
                {primary.label}
              </Link>
            </div>
          </div>

          <div className='pp-flow__sheetwrap'>
            <Note color='var(--pp-e-ink)' arrow='down' className='pp-note--sheet'>
              Sample
            </Note>
            <article className='pp-sheet' aria-label='Sample report excerpt' data-reveal='sheet'>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16}}>
                <h3 className='pp-display pp-h3'>Your five traits</h3>
              </div>
              <div className='pp-sheet__grid'>
                {cine ? (
                  <ColorWheel scores={SAMPLE.scores} label='Sample color wheel drawn from the sample scores.' />
                ) : (
                  <div className='pp-flow__platewrap' data-reveal='plate'>
                    <ColorPlate scores={SAMPLE.scores} label='Sample color plate drawn from the sample scores.' />
                  </div>
                )}
                <ul className='pp-scales' data-reveal='scales'>
                  {TRAITS.map((tr, i) => (
                    <li key={tr.ocean}>
                      <div className='pp-scale__row'>
                        <span>{tr.ocean}</span>
                        <span>{SAMPLE.scores[i]}th</span>
                      </div>
                      <div
                        className='pp-scale__track'
                        role='img'
                        aria-label={`${tr.ocean}: ${SAMPLE.scores[i]}th percentile`}>
                        <span
                          className='pp-scale__fill'
                          style={{width: `${SAMPLE.scores[i]}%`, background: tr.color}}
                        />
                      </div>
                      <div className='pp-scale__aspects'>
                        <span>
                          {tr.aspects[0]} {SAMPLE.aspects[i][0]}
                        </span>
                        <span>
                          {tr.aspects[1]} {SAMPLE.aspects[i][1]}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{borderTop: '2px solid #15172B', marginTop: 32, paddingTop: 20}}>
                <h4 style={{margin: '0 0 8px', fontSize: 16}}>From the Openness section</h4>
                <p style={{margin: 0}}>{sampleExcerpt}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- Patrick (a cinematic room) ---------- */}
      <section id='about' className='pp-section pp-field pp-room pp-room--black'>
        <Waypoint color={C} />
        <div className='pp-wrap'>
          <div className='pp-section-head'>
            <h2 className='pp-display pp-h2 pp-flow__h2xl' data-reveal='wipe'>
              Who’s behind it
            </h2>
          </div>
          <div className='pp-trust pp-flow__trust'>
            <div className='pp-person'>
              <div className='pp-flow__portrait' data-reveal='portrait'>
                <img src={patrick} alt='Patrick Knicely' loading='lazy' />
              </div>
              <div className='pp-body' style={{display: 'grid', gap: 12}} data-reveal='rise'>
                <h3 className='pp-display pp-h3'>Patrick Knicely</h3>
                <p style={{margin: 0}}>
                  Licensed Professional Counselor (LPC) in Virginia and licensed teacher. Personality researcher working
                  with the Big Five Aspects model, trained in biblical scholarship under Michael S. Heiser.
                </p>
                <p style={{margin: 0}}>
                  A former middle and high school teacher, wrestling and swimming coach, and conference teacher for other
                  counselors. He takes the best of academic psychology and biblical scholarship and helps everyday
                  people put it to work in their lives.
                </p>
                <Link to='/about' className='pp-textlink' style={{justifySelf: 'start'}}>
                  More about Patrick
                </Link>
              </div>
            </div>
            <div style={{display: 'grid', gap: 20, alignContent: 'start'}} data-reveal='rise'>
              <p style={{margin: 0}} className='pp-body'>
                The questions use the Big Five Aspect Scales, a public-domain instrument from published research. Your
                answers are compared with published norms for men and women, using the averages and spreads for your
                own group.
              </p>
              <ul className='pp-cites'>
                <li>
                  DeYoung, C. G., Quilty, L. C., &amp; Peterson, J. B. (2007). Between facets and domains: 10 aspects of
                  the Big Five. <em>Journal of Personality and Social Psychology, 93</em>, 880–896.
                </li>
                <li>
                  Weisberg, Y. J., DeYoung, C. G., &amp; Hirsh, J. B. (2011). Gender differences in personality across
                  the ten aspects of the Big Five. <em>Frontiers in Psychology, 2</em>, 178.
                </li>
                <li>
                  Knicely, P., &amp; Forrest, A. (2021). Counseling and personality: Introduction to the taxonomy of the
                  Big Five as an assessment tool. <em>The Virginia Counselors Journal, 38</em>, 32–39.
                </li>
              </ul>
              <p className='pp-small' style={{margin: 0}}>
                The test is a tool for understanding yourself. It is not a diagnosis, and it is not counseling.
              </p>
              <Link to='/faqs' className='pp-textlink'>
                Read the FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- close (a solid trait-color room) ---------- */}
      <section className={`pp-section pp-room ${cine ? 'pp-room--dawn pp-field' : 'pp-room--red'}`}>
        <Waypoint color={N} />
        {cine && <Scene kind='ridges' className='pp-scene--dawn' sun={E} sunX={720} sunY={130} />}
        <div className='pp-wrap pp-close'>
          <div style={{display: 'grid', gap: 20}}>
            <div data-reveal='bars'>
              <Strip />
            </div>
            <h2 className='pp-display pp-h2 pp-flow__h2xl' data-reveal='wipe'>
              Trade the guess for <Mark color={cine ? E : 'var(--pp-ink)'}>the real thing.</Mark>
            </h2>
            <p className='pp-lede' style={{maxWidth: '46ch'}} data-reveal='rise'>
              Already have your results?{' '}
              <a href={BOOKING_URL} target='_blank' rel='noopener noreferrer' className='pp-textlink'>
                {BOOKING_LABEL}
              </a>{' '}
              and talk them through with Patrick.
            </p>
          </div>
          <div data-reveal='rise'>
            <Link to={primary.to} className='pp-btn pp-flow-btn' data-cta onClick={clearSession}>
              {primary.label}
            </Link>
          </div>
        </div>
      </section>

      <div className='pp-dock' data-show={showDock} aria-hidden={!showDock}>
        <Link to={primary.to} className='pp-btn' tabIndex={showDock ? 0 : -1} onClick={clearSession}>
          {primary.label}
        </Link>
      </div>
    </div>
  );
};

export default HomeCinematic;
