import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import ColorPlate from '../design/ColorPlate';
import Strip from '../design/Strip';
import {BOOKING_LABEL, BOOKING_URL, PRICE, TRAITS} from '../design/traits';
import {interpretations} from '../constants/interpretations';
import patrick from '../images/patrick.jpeg';

interface HomeProps {
  loggedIn: boolean;
  completed: boolean;
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

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  // Sampler: the visitor's own guesses, 0–100.
  const [guess, setGuess] = useState<number[]>([50, 50, 50, 50, 50]);
  const [active, setActive] = useState<number | null>(null);
  const [touched, setTouched] = useState<number | null>(null);
  // Explorer: which trait is open.
  const [open, setOpen] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [showDock, setShowDock] = useState(false);
  const heroActions = useRef<HTMLDivElement>(null);

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
    <div className='pp'>
      {/* ---------- first viewport: the sampler ---------- */}
      <section className='pp-hero'>
        <div className='pp-wrap pp-hero__grid pp-hero__grid--sampler'>
          <div className='pp-hero__copy'>
            <p className='pp-verse'>
              You are His workmanship. Made for good works. <cite>Ephesians 2:10</cite>
            </p>
            <h1 className='pp-display pp-h1'>Find out how God made you. Then find out what for.</h1>
            <p className='pp-lede'>
              A 100-question Big Five personality test from Patrick Knicely, LPC: personality researcher and
              biblical scholar.
            </p>
            <div className='pp-hero__actions' ref={heroActions}>
              <Link to={primary.to} className='pp-btn' data-cta onClick={clearSession}>
                {primary.label}
              </Link>
              <Link to='/#report' className='pp-textlink'>
                See a sample report
              </Link>
            </div>
            <ul className='pp-hero__facts'>
              <li>100 questions</li>
              <li>10–20 minutes</li>
              <li>Results to keep and download</li>
            </ul>
          </div>

          <div className='pp-sampler'>
            <ColorPlate
              scores={guess}
              focus={active}
              label={`Your guessed color plate: ${TRAITS.map((tr, i) => `${tr.ocean} ${guess[i]}`).join(', ')}.`}
            />
            <div className='pp-sampler__head'>
              <h2 className='pp-sampler__title'>Move the sliders. Guess your mix.</h2>
              <span className='pp-sample-tag'>Preview, not a result</span>
            </div>
            <ul className='pp-sliders'>
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

      {/* ---------- why: the faith side ---------- */}
      <section id='why' className='pp-section pp-field pp-field--ink'>
        <div className='pp-wrap pp-why'>
          <div>
            <ul className='pp-why__qs'>
              <li>Why do you think the way you do?</li>
              <li>Why does the work you were made for feel so far from the work you settled for?</li>
              <li>And what if who you are and what God made you for were never at odds?</li>
            </ul>
            <p className='pp-display pp-why__land'>Know how you’re made. Live what you’re made for.</p>
          </div>
          <div className='pp-why__side'>
            <p>
              Personality science tells you how you’re built. The Bible’s bigger story tells you why it matters: you were
              made as one of God’s imagers, to represent Him with the temperament you actually have, not the one someone
              told you to want.
            </p>
            <p>People are built differently. One size never fits all.</p>
            <Link to='/#about' className='pp-textlink'>
              About Patrick
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- trait explorer ---------- */}
      <section id='traits' className='pp-section'>
        <div className='pp-wrap'>
          <div className='pp-section-head'>
            <h2 className='pp-display pp-h2'>Five traits. Ten aspects. Open each one.</h2>
            <p className='pp-lede' style={{maxWidth: '54ch'}}>
              None is good or bad on its own. What matters is your mix, and what you do with it.
            </p>
          </div>
          <div className='pp-explorer'>
            <div className='pp-explorer__tabs' role='tablist' aria-label='The five traits'>
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
            <div className='pp-explorer__panel' role='tabpanel' id='trait-panel' aria-labelledby={`trait-tab-${open}`}>
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
      </section>

      {/* ---------- how it works ---------- */}
      <section id='how' className='pp-section pp-field--deep'>
        <div className='pp-wrap'>
          <div className='pp-section-head'>
            <h2 className='pp-display pp-h2'>How it works</h2>
          </div>
          <ol className='pp-steps'>
            <li>
              <span className='pp-steps__n'>1</span>
              <h3 className='pp-display pp-h3'>Buy the test</h3>
              <p style={{margin: 0}}>
                {PRICE}, paid securely through Stripe. You create your account right after checkout. One purchase is one
                test, so use a new email for each person.
              </p>
            </li>
            <li>
              <span className='pp-steps__n'>2</span>
              <h3 className='pp-display pp-h3'>Answer 100 questions</h3>
              <p style={{margin: 0}}>
                Takes 10–20 minutes. Pick a quiet moment when you are rested; you take it once, so your answers stay
                honest.
              </p>
            </li>
            <li>
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
      <section id='report' className='pp-section pp-field pp-field--ink'>
        <div className='pp-wrap pp-report'>
          <div style={{display: 'grid', gap: 24}}>
            <h2 className='pp-display pp-h2'>What your report shows</h2>
            <p className='pp-lede'>
              Where you sit on each trait and aspect compared with other people, and what that means in plain language.
            </p>
            <ul className='pp-hero__facts' style={{color: '#B9BACB', display: 'grid', gap: 10}}>
              <li>Percentiles for 5 traits and 10 aspects</li>
              <li>Written interpretation for every trait</li>
              <li>Strengths and areas to grow</li>
              <li>Saved to your account, downloadable</li>
            </ul>
            <div>
              <Link to={primary.to} className='pp-btn pp-btn--light' data-cta onClick={clearSession}>
                {primary.label}
              </Link>
            </div>
          </div>

          <article className='pp-sheet' aria-label='Sample report excerpt'>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16}}>
              <h3 className='pp-display pp-h3'>Your five traits</h3>
              <span className='pp-sample-tag'>Sample</span>
            </div>
            <div className='pp-sheet__grid'>
              <ColorPlate scores={SAMPLE.scores} label='Sample color plate drawn from the sample scores.' />
              <ul className='pp-scales'>
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
                      <span className='pp-scale__fill' style={{width: `${SAMPLE.scores[i]}%`, background: tr.color}} />
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
      </section>

      {/* ---------- Patrick ---------- */}
      <section id='about' className='pp-section'>
        <div className='pp-wrap'>
          <div className='pp-section-head'>
            <h2 className='pp-display pp-h2'>Who’s behind it</h2>
          </div>
          <div className='pp-trust'>
            <div className='pp-person'>
              <img src={patrick} alt='Patrick Knicely' loading='lazy' />
              <div className='pp-body' style={{display: 'grid', gap: 12}}>
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
              </div>
            </div>
            <div style={{display: 'grid', gap: 20, alignContent: 'start'}}>
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

      {/* ---------- close ---------- */}
      <section className='pp-section pp-field--deep'>
        <div className='pp-wrap pp-close'>
          <div style={{display: 'grid', gap: 20}}>
            <Strip />
            <h2 className='pp-display pp-h2'>Trade the guess for the real thing.</h2>
            <p className='pp-lede' style={{maxWidth: '46ch'}}>
              Already have your results?{' '}
              <a href={BOOKING_URL} target='_blank' rel='noopener noreferrer' className='pp-textlink'>
                {BOOKING_LABEL}
              </a>{' '}
              and talk them through with Patrick.
            </p>
          </div>
          <Link to={primary.to} className='pp-btn' data-cta onClick={clearSession}>
            {primary.label}
          </Link>
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

export default Home;
