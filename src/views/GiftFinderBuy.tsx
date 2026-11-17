import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Banner from '../components/Banner';
import {checkoutUrl, GIFT_FINDER_ON_SALE, GIFT_FINDER_PRICE} from '../utils/giftFinderAccess';
import ImagerTree from '../design/ImagerTree';
import {TRAITS} from '../design/traits';
import {EMPTY_ENTRY, Entry, fitsScore, GIFT_ITEMS, GiftKind} from '../constants/giftFinder';
import {SAMPLE_PERCENTILES} from '../constants/giftFinderSample';

// A sample tree so people can see what they are buying: one item per trait that fits the sample
// scores ("Alex", not a real person), with some of the writing dots filled in. A picture only.
const sampleP = (a: string) => SAMPLE_PERCENTILES[a] ?? 50;
const sampleIds = (kind: GiftKind) =>
  TRAITS.flatMap((t) => {
    const x = GIFT_ITEMS.find((i) => i.kind === kind && t.aspects.includes(i.aspect) && fitsScore(i, sampleP(i.aspect)));
    return x ? [x.id] : [];
  });
const SAMPLE_GIFTS = sampleIds('gift');
const SAMPLE_BLINDS = sampleIds('blind').slice(0, 4);
const WRITTEN: Entry = {...EMPTY_ENTRY, story: '.', better: '.', forward: '.', serve: '.'};
const SAMPLE_ENTRIES: Record<string, Entry> = {
  ...Object.fromEntries(SAMPLE_GIFTS.slice(0, 3).map((id) => [id, WRITTEN])),
  ...(SAMPLE_GIFTS[3] ? {[SAMPLE_GIFTS[3]]: {...EMPTY_ENTRY, story: '.', better: '.'}} : {}),
  ...(SAMPLE_BLINDS[0] ? {[SAMPLE_BLINDS[0]]: WRITTEN} : {}),
  ...(SAMPLE_BLINDS[1] ? {[SAMPLE_BLINDS[1]]: {...EMPTY_ENTRY, story: '.'}} : {}),
};

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
      <div className='pp-wrap pp-buy pp-buy--gf'>
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

      {/* below the price, so the price card (which stays in view as you scroll) never covers it */}
      <div className='pp-wrap'>
        <figure className='pp-gf-buytree'>
          <span className='pp-sample-tag'>Sample</span>
          <ImagerTree
            name='Alex'
            p={sampleP}
            gifts={SAMPLE_GIFTS}
            blinds={SAMPLE_BLINDS}
            entries={SAMPLE_ENTRIES}
            still
          />
        </figure>
      </div>
    </div>
  );
};

export default GiftFinderBuy;
