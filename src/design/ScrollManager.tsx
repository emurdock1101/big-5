import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const SITE = 'Personality+';

/** Browser-tab title for each page. */
const TITLES: Record<string, string> = {
  '/': `${SITE} — Find out how God made you | Big Five personality test`,
  '/about': `About Patrick Knicely · ${SITE}`,
  '/faqs': `Questions, answered · ${SITE}`,
  '/contact': `Contact · ${SITE}`,
  '/buy': `Get your report · ${SITE}`,
  '/privacy': `Privacy · ${SITE}`,
  '/made-to-image': `Made to Image · ${SITE}`,
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
  '/compare-preview': `Compare preview · ${SITE}`,
  '/gift-finder-preview': `Gift Finder preview · ${SITE}`,
  '/gift-finder': `Gift Finder · ${SITE}`,
  '/gift-finder-buy-preview': `Gift Finder buy preview · ${SITE}`,
};

const ORIGIN = 'https://www.discoverpersonalityplus.com';

/**
 * The line search engines show under each public page's title. Built from wording already on
 * that page. The homepage's is also written into public/index.html, for readers that don't run scripts.
 */
const HOME_DESCRIPTION =
  'Find out how God made you. Then find out what for. A 100-question Big Five personality test with a personal report on your five traits and ten aspects. $9.99.';
const DESCRIPTIONS: Record<string, string> = {
  '/': HOME_DESCRIPTION,
  '/about':
    'The man behind the test, and the engineer who built it. Patrick Knicely, LPC: personality researcher and biblical scholar.',
  '/faqs': 'How the test was made, why you take it once, and what to do with your results.',
  '/buy': 'One test, one report, yours to keep. 100 questions, 10–20 minutes, $9.99.',
  '/made-to-image': 'Made to Image, a free workbook from Personality+.',
  '/contact': 'How can we help? Get in touch with Personality+.',
  '/privacy': 'What we keep, and what we don’t.',
  '/login': 'Your results are saved to your account. Log in to see them anytime.',
};

/** Set one tag in the page head, by its selector and attribute. */
const setHead = (selector: string, attr: string, value: string) =>
  document.head.querySelector(selector)?.setAttribute(attr, value);

/** On page change: set the tab title, then scroll to top or to the #section the link names. */
const ScrollManager: React.FC = () => {
  const {pathname, hash} = useLocation();

  useEffect(() => {
    document.title =
      TITLES[pathname] ??
      (pathname.startsWith('/admin')
        ? TITLES['/admin']
        : pathname.startsWith('/compare/')
        ? `Compare results · ${SITE}`
        : TITLES['/']);

    // The same for what search engines and link previews read: description, address, and whether to
    // list the page at all. Only the public pages are listed; account pages ask not to be.
    const open = pathname in DESCRIPTIONS;
    const description = DESCRIPTIONS[pathname] ?? HOME_DESCRIPTION;
    const url = `${ORIGIN}${pathname === '/' ? '/' : pathname}`;
    setHead('meta[name="description"]', 'content', description);
    setHead('meta[property="og:description"]', 'content', description);
    setHead('meta[name="twitter:description"]', 'content', description);
    setHead('meta[property="og:title"]', 'content', document.title);
    setHead('meta[name="twitter:title"]', 'content', document.title);
    setHead('meta[property="og:url"]', 'content', url);
    setHead('link[rel="canonical"]', 'href', url);
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', open ? 'index, follow' : 'noindex');
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
