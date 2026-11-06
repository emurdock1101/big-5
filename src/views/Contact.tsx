import React from 'react';
import Banner from '../components/Banner';
import {BOOKING_URL, CONTACT_EMAIL, SOCIAL} from '../design/traits';

const Contact: React.FC = () => (
  <div className='pp'>
    <Banner pageTitle='How can we help?' />
    <div className='pp-wrap pp-trust' style={{paddingBottom: 'clamp(72px, 10vw, 140px)'}}>
      <section aria-labelledby='call' style={{display: 'grid', gap: 20, alignContent: 'start'}}>
        <h2 id='call' className='pp-display pp-h3'>
          Book a results conversation
        </h2>
        <p className='pp-body' style={{margin: 0}}>
          Already taken the test? Talk your results through with Patrick.
        </p>
        <div>
          <a href={BOOKING_URL} target='_blank' rel='noopener noreferrer' className='pp-btn'>
            Choose a time
          </a>
        </div>
      </section>
      <section aria-labelledby='write' style={{display: 'grid', gap: 20, alignContent: 'start'}}>
        <h2 id='write' className='pp-display pp-h3'>
          Write to us
        </h2>
        <p className='pp-body' style={{margin: 0}}>
          Questions about the test or your results:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{fontWeight: 700}}>
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className='pp-body' style={{margin: 0, display: 'flex', gap: 24, flexWrap: 'wrap'}}>
          <a href={SOCIAL.facebook} target='_blank' rel='noopener noreferrer'>
            Facebook
          </a>
          <a href={SOCIAL.instagram} target='_blank' rel='noopener noreferrer'>
            Instagram
          </a>
          <a href={SOCIAL.x} target='_blank' rel='noopener noreferrer'>
            X
          </a>
        </p>
      </section>
    </div>
  </div>
);

export default Contact;
