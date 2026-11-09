import React from 'react';
import {Link} from 'react-router-dom';
import Banner from '../components/Banner';

const Privacy: React.FC = () => (
  <div className='pp'>
    <Banner pageTitle='Privacy' intro='What we keep, and what we don’t.' />
    <div className='pp-wrap' style={{paddingBottom: 'clamp(72px, 10vw, 140px)'}}>
      <div className='pp-body pp-privacy'>
        <section>
          <h2 className='pp-display pp-h3'>What we store</h2>
          <p>
            Your email, the name and comparison group (men or women) you enter before the test, and your test results.
            These are saved to your account so you can see your results whenever you log in.
          </p>
        </section>
        <section>
          <h2 className='pp-display pp-h3'>Payment</h2>
          <p>Your card details are collected by Stripe, our payment processor. They never reach us.</p>
        </section>
        <section>
          <h2 className='pp-display pp-h3'>What we don’t store</h2>
          <p>Your browser information, IP address and device fingerprint are not stored.</p>
        </section>
        <section>
          <h2 className='pp-display pp-h3'>Sharing</h2>
          <p>No personal data is sold or shared with anyone. Never has been, never will be.</p>
        </section>
        <section>
          <h2 className='pp-display pp-h3'>Comparing with someone</h2>
          <p>
            Only if you choose to. When you make a compare link, we save a copy of your scores and the name you choose
            to show, but not your email. Anyone with that link and an account can see those scores. Unlink it from your
            results page and the link stops working right away; anyone who already viewed it may remember what they
            saw.
          </p>
        </section>
        <p className='pp-small'>
          Questions about this policy? <Link to='/contact'>Get in touch</Link>.
        </p>
      </div>
    </div>
  </div>
);

export default Privacy;
