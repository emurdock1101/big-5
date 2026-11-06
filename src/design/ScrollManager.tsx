import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const SITE = 'Personality+';

/** Browser-tab title for each page. */
const TITLES: Record<string, string> = {
  '/': `${SITE} — Find out how God made you`,
  '/about': `About Patrick Knicely · ${SITE}`,
  '/faqs': `Questions, answered · ${SITE}`,
  '/contact': `Contact · ${SITE}`,
  '/buy': `Get your report · ${SITE}`,
  '/privacy': `Privacy · ${SITE}`,
  '/login': `Log in · ${SITE}`,
  '/signup': `Set up your account · ${SITE}`,
  '/reset': `Reset your password · ${SITE}`,
  '/test': `The test · ${SITE}`,
  '/submit': `Submit your answers · ${SITE}`,
  '/results': `Your results · ${SITE}`,
  '/admin': `Admin · ${SITE}`,
  '/error': `Page not found · ${SITE}`,
  '/checkouterror': `Checkout didn’t start · ${SITE}`,
  '/results-preview': `Results preview · ${SITE}`,
  '/test-preview': `Test preview · ${SITE}`,
};

/** On page change: set the tab title, then scroll to top or to the #section the link names. */
const ScrollManager: React.FC = () => {
  const {pathname, hash} = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] ?? (pathname.startsWith('/admin') ? TITLES['/admin'] : TITLES['/']);
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      // wait a frame so the target section has rendered
      const id = hash.slice(1);
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 30);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
