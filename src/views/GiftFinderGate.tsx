import React, {lazy, useCallback, useContext, useEffect, useState} from 'react';
import {Link, Navigate, useLocation} from 'react-router-dom';
import {UserContext} from '../App';
import Loading from '../components/Loading';
import {freshGroups, GIFT_FINDER_GROUP, GIFT_FINDER_ON_SALE} from '../utils/giftFinderAccess';
import GiftFinderBuy from './GiftFinderBuy';

const GiftFinderPage = lazy(() => import('./GiftFinderPage'));

/**
 * /gift-finder decides what each visitor sees:
 * - owners (bought it) and admins: the Gift Finder itself;
 * - just paid (?purchased=1): a short "unlocking" wait while the payment program adds them;
 * - signed-in people who don't own it, once it's on sale: what it is and the buy button;
 * - everyone else: the homepage.
 */
const WAIT_STEP_MS = 3000;
const WAIT_TRIES = 20; // about a minute

const Unlocking: React.FC<{onUnlocked: () => void}> = ({onUnlocked}) => {
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    let alive = true;
    let tries = 0;
    const check = async () => {
      tries += 1;
      try {
        if ((await freshGroups()).includes(GIFT_FINDER_GROUP)) {
          if (alive) onUnlocked();
          return;
        }
      } catch (e) {
        console.error(e);
      }
      if (!alive) return;
      if (tries >= WAIT_TRIES) setGaveUp(true);
      else window.setTimeout(check, WAIT_STEP_MS);
    };
    check();
    return () => {
      alive = false;
    };
  }, [onUnlocked]);

  return (
    <div className='pp pp-wrap pp-pagehead' aria-busy={!gaveUp}>
      <h1 className='pp-display pp-h2'>{gaveUp ? 'Almost there' : 'Unlocking your Gift Finder…'}</h1>
      {gaveUp ? (
        <p className='pp-lede'>
          Your payment went through. Unlocking is taking longer than usual: refresh this page in a minute. If it still
          doesn’t open, <Link to='/contact'>contact us</Link> and we’ll sort it out.
        </p>
      ) : (
        <p className='pp-lede'>Thanks for your purchase. This takes a few seconds.</p>
      )}
    </div>
  );
};

const GiftFinderGate: React.FC = () => {
  const {user, setUser} = useContext(UserContext);
  const {search} = useLocation();
  const justPaid = new URLSearchParams(search).has('purchased');
  // Stable, so the unlock check doesn't restart when this page re-renders.
  const unlocked = useCallback(() => setUser((u) => ({...u, hasGiftFinder: true})), [setUser]);

  if (user.loggedIn === undefined || user.completed === undefined) return <Loading />;
  if (!user.loggedIn) return <Navigate to='/login' replace />;
  if (user.isAdmin || user.hasGiftFinder) return <GiftFinderPage />;
  if (justPaid) return <Unlocking onUnlocked={unlocked} />;
  if (!GIFT_FINDER_ON_SALE) return <Navigate to='/' replace />;
  return <GiftFinderBuy hasResults={!!user.completed} />;
};

export default GiftFinderGate;
