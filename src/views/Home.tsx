import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import ColorPlate from '../design/ColorPlate';
import Strip from '../design/Strip';
import {BOOKING_URL, PRICE, SOFT_NAME, TRAITS} from '../design/traits';
import {interpretations} from '../constants/interpretations';
import patrick from '../images/patrick.jpeg';

interface HomeProps {
  loggedIn: boolean;
  completed: boolean;
}

// Illustrative mixes for the hero plate. Not anyone's real results.
const MIXES: {name: string; scores: number[]}[] = [
  {name: 'Mix A', scores: [72, 31, 64, 48, 85]},
  {name: 'Mix B', scores: [28, 55, 81, 77, 40]},
  {name: 'Mix C', scores: [90, 18, 35, 62, 58]},
];

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
  const [mix, setMix] = useState(0);
  const [focus, setFocus] = useState<number | null>(null);
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

  const current = MIXES[mix];

  return (
    <div className='pp'>
      {/* ---------- first viewport ---------- */}
      <section className='pp-hero'>
        <div className='pp-wrap pp-hero__grid'>
          <div className='pp-hero__copy'>
            <h1 className='pp-display pp-h1'>You are not one color. You are five, in proportion.</h1>
            <p className='pp-lede'>
              A 100-question Big Five personality test with a personal report on your five traits and ten aspects,
              written from a licensed therapist’s practice.
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

          <div className='pp-hero__plate'>
            <ColorPlate
              scores={current.scores}
              focus={focus}
              label={`Five nested color squares, one per trait, each band sized by an example score. ${current.name}: ${TRAITS.map(
                (t, i) => `${t.ocean} ${current.scores[i]}`,
              ).join(', ')}.`}
            />
            <ul className='pp-legend' aria-label='Traits in this example mix'>
              {TRAITS.map((t, i) => (
                <li key={t.ocean}>
                  <button
                    type='button'
                    aria-pressed={focus === i}
                    onMouseEnter={() => setFocus(i)}
                    onMouseLeave={() => setFocus(null)}
                    onFocus={() => setFocus(i)}
                    onBlur={() => setFocus(null)}
                    onClick={() => setFocus(focus === i ? null : i)}>
                    <span className='pp-legend__chip' style={{background: t.color}} />
                    <span className='pp-legend__name'>{SOFT_NAME[t.ocean] ?? t.ocean}</span>
                    <span className='pp-legend__short' aria-hidden='true'>
                      {t.ocean[0]}
                    </span>
                    <span className='pp-legend__score'>{current.scores[i]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className='pp-small' style={{margin: 0, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
              <span>Example mix, not real results. Your report draws your own.</span>
              <button type='button' className='pp-textlink' onClick={() => setMix((m) => (m + 1) % MIXES.length)}>
                Try another mix
              </button>
            </p>
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

      {/* ---------- the five traits ---------- */}
      <section id='traits' className='pp-section'>
        <div className='pp-wrap'>
          <div className='pp-section-head'>
            <h2 className='pp-display pp-h2'>The five traits, and their ten aspects</h2>
            <p className='pp-lede' style={{maxWidth: '52ch'}}>
              The Big Five is the research-based model of personality used throughout psychology. Each trait splits into two aspects,
              and none is good or bad on its own: what matters is your mix.
            </p>
          </div>
          <ul className='pp-traits'>
            {TRAITS.map((t) => (
              <li key={t.ocean}>
                <div className='pp-trait__field' style={{background: t.color}} aria-hidden='true' />
                <div className='pp-trait__band'>
                  <h3 className='pp-display pp-h3'>{SOFT_NAME[t.ocean] ?? t.ocean}</h3>
                  <span className='pp-trait__aspects'>
                    {t.aspects[0]} · {t.aspects[1]}
                  </span>
                  <p className='pp-trait__line'>{t.line}</p>
                </div>
              </li>
            ))}
          </ul>
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
            <ul className='pp-hero__facts' style={{color: '#C9CADB', display: 'grid', gap: 10}}>
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
                {TRAITS.map((t, i) => (
                  <li key={t.ocean}>
                    <div className='pp-scale__row'>
                      <span>{t.ocean}</span>
                      <span>{SAMPLE.scores[i]}th</span>
                    </div>
                    <div
                      className='pp-scale__track'
                      role='img'
                      aria-label={`${t.ocean}: ${SAMPLE.scores[i]}th percentile`}>
                      <span className='pp-scale__fill' style={{width: `${SAMPLE.scores[i]}%`, background: t.color}} />
                    </div>
                    <div className='pp-scale__aspects'>
                      <span>
                        {t.aspects[0]} {SAMPLE.aspects[i][0]}
                      </span>
                      <span>
                        {t.aspects[1]} {SAMPLE.aspects[i][1]}
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

      {/* ---------- who and what it's built on ---------- */}
      <section className='pp-section'>
        <div className='pp-wrap'>
          <div className='pp-section-head'>
            <h2 className='pp-display pp-h2'>Built on research, written by a therapist</h2>
          </div>
          <div className='pp-trust'>
            <div className='pp-person'>
              <img src={patrick} alt='Patrick Knicely' loading='lazy' />
              <div className='pp-body' style={{display: 'grid', gap: 12}}>
                <h3 className='pp-display pp-h3'>Patrick Knicely</h3>
                <p style={{margin: 0}}>
                  Licensed clinical mental health therapist and clinical consultant for inpatient and ambulatory
                  healthcare settings. B.A., Roanoke College; M.S., Radford University.
                </p>
                <p style={{margin: 0}}>
                  The report’s interpretations come from research, study and clinical practice.
                </p>
                <Link to='/about' className='pp-textlink'>
                  About the team
                </Link>
              </div>
            </div>
            <div style={{display: 'grid', gap: 20, alignContent: 'start'}}>
              <p style={{margin: 0}} className='pp-body'>
                The questions use the Big Five Aspect Scales, a public-domain instrument from published research. Your
                answers are scored against how many other people described themselves.
              </p>
              <blockquote className='pp-cite'>
                DeYoung, C. G., Quilty, L. C., &amp; Peterson, J. B. (2007). Between facets and domains: 10 aspects of
                the Big Five. <em>Journal of Personality and Social Psychology, 93</em>, 880–896.
              </blockquote>
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
            <h2 className='pp-display pp-h2'>See your own five colors.</h2>
            <p className='pp-lede' style={{maxWidth: '44ch'}}>
              Prefer to talk first?{' '}
              <a href={BOOKING_URL} target='_blank' rel='noopener noreferrer' className='pp-textlink'>
                Book a free 15-minute call
              </a>{' '}
              about the test or coaching.
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
