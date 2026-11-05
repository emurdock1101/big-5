import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

/** Scroll to top on page change, or to the #section when the link names one. */
const ScrollManager: React.FC = () => {
  const {pathname, hash} = useLocation();

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
