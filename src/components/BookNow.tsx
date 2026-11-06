import React from 'react';
import {BOOKING_URL} from '../design/traits';

/** Closing band: talk to someone about your results. */
const BookNow: React.FC = () => (
  <section className='pp pp-section pp-field--deep'>
    <div className='pp-wrap pp-close'>
      <div style={{display: 'grid', gap: 16}}>
        <h2 className='pp-display pp-h2'>Talk your results through</h2>
        <p className='pp-lede' style={{maxWidth: '48ch'}}>
          Book a results conversation and talk your scores through with Patrick.
        </p>
      </div>
      <a href={BOOKING_URL} target='_blank' rel='noopener noreferrer' className='pp-btn'>
        Book a results conversation
      </a>
    </div>
  </section>
);

export default BookNow;
