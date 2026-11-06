import React from 'react';
import {Link} from 'react-router-dom';
import FaqsAccordion from '../components/FaqsAccordion';
import Banner from '../components/Banner';
import {CONTACT_EMAIL} from '../design/traits';

const FAQs: React.FC = () => (
  <div className='pp'>
    <Banner pageTitle='Questions, answered' intro='How the test was made, why you take it once, and what to do with your results.' />
    <div className='pp-wrap' style={{paddingBottom: 'clamp(72px, 10vw, 140px)'}}>
      <FaqsAccordion />
      <p className='pp-body' style={{marginTop: 40}}>
        Still wondering about something? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or see{' '}
        <Link to='/contact'>other ways to reach us</Link>.
      </p>
    </div>
  </div>
);

export default FAQs;
