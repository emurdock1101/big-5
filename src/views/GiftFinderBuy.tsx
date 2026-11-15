import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Banner from '../components/Banner';
import {checkoutUrl, GIFT_FINDER_ON_SALE, GIFT_FINDER_PRICE} from '../utils/giftFinderAccess';

/**
 * What the Gift Finder is, and the button to buy it. Shown to signed-in people who don't own it yet.
 * DRAFT wording for Patrick to approve or rewrite.
 */
const GiftFinderBuy: React.FC<{hasResults?: boolean; preview?: boolean}> = ({hasResults = true, preview}) => {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const buy = async () => {
    setBusy(true);
    setFailed(false);
    try {
      window.location.assign(await checkoutUrl());
    } catch (e) {
      console.error(e);
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <div className='pp'>
      <Banner
        pageTitle='The Gift Finder'
        intro='Your scores, put to work: the gifts you carry, the blind spots that trip you up, and what they are for.'
      />
      <div className='pp-wrap pp-buy'>
        <section aria-labelledby='gf-included'>
          <h2 id='gf-included' className='pp-display pp-h3' style={{marginBottom: 20}}>
            What’s included
          </h2>
          <ul className='pp-included'>
            <li>Your own scores, already filled in from your test.</li>
            <li>Reflection pages written around your percentiles, and scenarios that test what your scores predict.</li>
            <li>
              Gifts and blind spots: pick the ones that sound like you, rank them, and write about each with prompts
              that walk you through it.
            </li>
            <li>Your imager tree: everything you write, gathered into one picture you can come back to.</li>
            <li>Saved privately to your account as you go. Only you can read what you write.</li>
          </ul>
        </section>

        <aside className='pp-price pp-sheet' aria-label='Price and checkout'>
          <span className='pp-price__amount'>{GIFT_FINDER_PRICE}</span>
          <span style={{fontWeight: 700}}>One-time payment. No subscription.</span>
          {!hasResults ? (
            <Link to='/test' className='pp-btn'>
              Finish your test first
            </Link>
          ) : preview || !GIFT_FINDER_ON_SALE ? (
            <button type='button' className='pp-btn' disabled>
              Get the Gift Finder
            </button>
          ) : (
            <button type='button' className='pp-btn' onClick={buy} disabled={busy}>
              {busy ? 'Opening checkout…' : 'Get the Gift Finder'}
            </button>
          )}
          {failed && (
            <p className='pp-small' role='alert' style={{margin: 0}}>
              Checkout didn’t open. Check your connection and try again.
            </p>
          )}
          <ul className='pp-notes'>
            {preview && <li>Preview: the button opens Stripe checkout once the payment link is set up.</li>}
            <li>Payment is handled by Stripe. When you’re done, you come straight back here and it opens.</li>
            <li>It uses the same login as your results. Nothing new to set up.</li>
            <li>
              <Link to='/privacy'>How we handle your data</Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default GiftFinderBuy;
