import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Strip from '../design/Strip';

interface PreTestProps {
  nextStep: () => void;
}

const PreTest: React.FC<PreTestProps> = (props: PreTestProps) => {
  const [gender, setGender] = useState(() => sessionStorage.getItem('gender') ?? '');
  const [name, setName] = useState(() => sessionStorage.getItem('name') ?? '');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({top: 0, left: 0});
  }, []);

  // The answers flow reads name and gender from sessionStorage when results are saved.
  useEffect(() => {
    if (name !== '') sessionStorage.setItem('name', name);
    if (gender !== '') sessionStorage.setItem('gender', gender);
  }, [name, gender]);

  const backHome = () => {
    if (sessionStorage.length > 0) sessionStorage.clear();
    navigate('/');
  };

  const ready = name.trim() !== '' && gender !== '';

  return (
    <div className='pp'>
      <div className='pp-wrap pp-pagehead'>
        <Strip />
        <h1 className='pp-display pp-h1'>Before you begin</h1>
        <p className='pp-lede' style={{maxWidth: '52ch'}}>
          100 statements, 10–20 minutes, and you take it once. A few minutes of preparation makes your results
          worth more.
        </p>
      </div>

      <div className='pp-wrap pp-pretest'>
        <div className='pp-pretest__read'>
          <section>
            <h2 className='pp-display pp-h3'>How it works</h2>
            <p>
              You’ll see 100 statements, such as “I am sad much of the time.” For each one, choose how much you agree
              or disagree that it describes you. There are ten pages of ten.
            </p>
          </section>

          <section>
            <h2 className='pp-display pp-h3'>Why only once</h2>
            <p>
              An accurate personality test has to be taken and scored the same way for everyone, so your answers can be
              compared fairly with everyone else’s. If you took it, read your results, then took it again, what you’d
              learned about yourself would quietly change your answers.
            </p>
          </section>

          <section>
            <h2 className='pp-display pp-h3'>Pick the right moment</h2>
            <p>Answer as you are on an ordinary day, not your best day or your worst. Before you start:</p>
            <ul className='pp-checklist'>
              <li>Eat something, and be well rested.</li>
              <li>Give yourself 20 minutes without rushing.</li>
              <li>Find a quiet place with no one else around.</li>
              <li>Put your phone and other distractions away.</li>
              <li>
                If you’re much more unhappy or anxious than usual right now, choose another day. Your answers would
                lean toward the negative.
              </li>
            </ul>
          </section>

          <section>
            <h2 className='pp-display pp-h3'>While you answer</h2>
            <ul className='pp-checklist'>
              <li>Don’t linger. If you’re unsure, trust your first instinct.</li>
              <li>Be as honest with yourself as you can.</li>
            </ul>
          </section>
        </div>

        <aside className='pp-pretest__form pp-sheet' aria-labelledby='about-you'>
          <h2 id='about-you' className='pp-display pp-h3'>
            About you
          </h2>
          <div className='pp-field-row'>
            <label htmlFor='pt-name'>Your name</label>
            <input
              id='pt-name'
              className='pp-input'
              type='text'
              autoComplete='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className='pp-small'>It appears on your report.</span>
          </div>
          <fieldset className='pp-field-row pp-fieldset'>
            <legend>Compare my scores with</legend>
            <div className='pp-choice'>
              {[
                {v: 'male', l: 'Men'},
                {v: 'female', l: 'Women'},
              ].map((o) => (
                <label key={o.v} className='pp-choice__opt'>
                  <input type='radio' name='pt-gender' value={o.v} checked={gender === o.v} onChange={() => setGender(o.v)} />
                  <span>{o.l}</span>
                </label>
              ))}
            </div>
            <span className='pp-small'>
              Men and women differ slightly on average in some traits, so your scores are compared with your own group.
            </span>
          </fieldset>
          <button type='button' className='pp-btn' onClick={props.nextStep} disabled={!ready}>
            Begin the test
          </button>
          {!ready && <span className='pp-small'>Add your name and choose a group to begin.</span>}
          <button type='button' className='pp-textlink' onClick={backHome} style={{justifySelf: 'start'}}>
            Not now, back to home
          </button>
        </aside>
      </div>
    </div>
  );
};

export default PreTest;
