import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
// The "pure" entry loads Stripe's script only when checkout starts, not on every page.
import {loadStripe} from '@stripe/stripe-js/pure';
import Banner from '../components/Banner';
import {PRICE} from '../design/traits';

const BuyTest: React.FC = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const checkout = async () => {
    setBusy(true);
    sessionStorage.clear();
    try {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY ?? '');
      if (stripe) {
        await stripe.redirectToCheckout({
          lineItems: [
            {
              price: process.env.REACT_APP_STRIPE_LINE_ITEM_PRICE,
              quantity: 1,
            },
          ],
          mode: 'payment',
          successUrl: (process.env.REACT_APP_DOMAIN ?? 'http://localhost:3000') + '/signup',
          cancelUrl: process.env.REACT_APP_DOMAIN ?? 'http://localhost:3000',
        });
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      navigate('/checkouterror');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className='pp'>
      <Banner pageTitle='Get your report' intro='One test, one report, yours to keep.' />
      <div className='pp-wrap pp-buy'>
        <section aria-labelledby='included'>
          <h2 id='included' className='pp-display pp-h3' style={{marginBottom: 20}}>
            What’s included
          </h2>
          <ul className='pp-included'>
            <li>One 100-question, research-based assessment of your personality.</li>
            <li>An in-depth analysis of your results, specific to your scores.</li>
            <li>Access to view your scores anytime, and download them.</li>
            <li>The option to book a results conversation with Patrick and talk your scores through.</li>
          </ul>
          <p className='pp-small' style={{marginTop: 24}}>
            Want to see it first? <Link to='/#report'>Look at a sample report</Link>.
          </p>
        </section>

        <aside className='pp-price pp-sheet' aria-label='Price and checkout'>
          <span className='pp-price__amount'>{PRICE}</span>
          <span style={{fontWeight: 700}}>One-time payment. No subscription.</span>
          <button type='button' className='pp-btn' onClick={checkout} disabled={busy}>
            {busy ? 'Opening checkout…' : 'Secure checkout'}
          </button>
          <ul className='pp-notes'>
            <li>Payment is handled by Stripe. You create your account right after.</li>
            <li>Each purchase covers one test. If you have bought before, check out with a different email.</li>
            <li>
              You take the test once. See <Link to='/faqs'>why</Link>.
            </li>
            <li>
              <Link to='/privacy'>How we handle your data</Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default BuyTest;
