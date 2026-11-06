import React, {useEffect, useState} from 'react';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import {Auth} from 'aws-amplify';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {PRICE, TRAITS} from '../design/traits';

interface HeaderDrawerProps {
  loggedIn: boolean;
  completed: boolean;
  isAdmin: boolean;
  onLogOut: () => void;
}

const NAV = [
  {to: '/#how', label: 'How it works'},
  {to: '/#traits', label: 'The five traits'},
  {to: '/#report', label: 'Sample report'},
  {to: '/#about', label: 'About Patrick'},
  {to: '/faqs', label: 'FAQs'},
];

export const Wordmark: React.FC = () => (
  <Link to='/' className='pp-wordmark' aria-label='Personality+ home'>
    <span className='pp-wordmark__mark' aria-hidden='true'>
      {TRAITS.map((t) => (
        <span key={t.ocean} style={{background: t.color}} />
      ))}
    </span>
    Personality+
    <span className='pp-wordmark__by'>by Patrick Knicely</span>
  </Link>
);

/** Site header: visible nav on desktop, a menu panel on small screens. */
const HeaderDrawer = (props: HeaderDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (path: string) => {
    if (sessionStorage.length > 0) sessionStorage.clear();
    navigate(path);
  };

  const logOut = async () => {
    try {
      await Auth.signOut();
      props.onLogOut();
      go('/');
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  };

  const primary = !props.loggedIn
    ? {to: '/buy', label: `Take the test — ${PRICE}`}
    : props.completed
    ? {to: '/results', label: 'Your results'}
    : {to: '/test', label: 'Take the test'};

  const account = props.loggedIn ? (
    <button type='button' className='pp-textlink' onClick={logOut}>
      Log out
    </button>
  ) : (
    <Link to='/login' className='pp-textlink'>
      Log in
    </Link>
  );

  return (
    <header className='pp pp-header'>
      <div className='pp-wrap pp-header__bar'>
        <Wordmark />
        <nav className='pp-nav' aria-label='Main'>
          {NAV.map((n) =>
            n.to.startsWith('/#') ? (
              <Link key={n.to} to={n.to}>
                {n.label}
              </Link>
            ) : (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ),
          )}
          {props.isAdmin && <NavLink to='/admin'>Admin</NavLink>}
        </nav>
        <div className='pp-header__actions'>
          <span className='pp-header__login'>{account}</span>
          <Link to={primary.to} className='pp-btn pp-btn--sm pp-header__cta'>
            {primary.label}
          </Link>
          <button
            type='button'
            className='pp-menu-btn'
            aria-expanded={open}
            aria-controls='pp-mobile-menu'
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <nav id='pp-mobile-menu' className='pp-mobile-menu' aria-label='Main'>
          <Link to={primary.to}>{primary.label}</Link>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>
              {n.label}
            </Link>
          ))}
          <Link to='/contact'>Contact</Link>
          {props.isAdmin && <Link to='/admin'>Admin</Link>}
          {account}
        </nav>
      )}
    </header>
  );
};

export default HeaderDrawer;
