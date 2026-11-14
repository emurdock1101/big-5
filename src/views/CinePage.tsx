import React, {useEffect, useRef, useState} from 'react';
import Scene from '../design/Scene';
import {TRAITS} from '../design/traits';

/*
 * Wraps an existing inner page (About, FAQs, Buy) in the cinematic look, a lighter dose of the
 * homepage. The page itself is not edited: its title block gets a night band with drawn
 * mountains and a red sun behind it, and the sections below rise in as they scroll into view.
 */

const CinePage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const root = useRef<HTMLDivElement>(null);
  const [headH, setHeadH] = useState(0);
  const [motion] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Dark header while this page is open.
  useEffect(() => {
    document.body.classList.add('pp-cine-body');
    return () => document.body.classList.remove('pp-cine-body');
  }, []);

  // The night band sits behind the page's own title block, so it follows that block's height.
  useEffect(() => {
    const head = root.current?.querySelector<HTMLElement>('.pp-pagehead');
    if (!head) return;
    const measure = () => setHeadH(head.offsetTop + head.offsetHeight);
    measure();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    ro?.observe(head);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Sections below the title rise in as they arrive.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = Array.from(
      el.querySelectorAll<HTMLElement>('.pp-wrap:not(.pp-pagehead) > *, .pp-faq > li')
    ).filter((t) => !t.closest('.pp-pagehead'));
    if (!motion || !('IntersectionObserver' in window)) return;
    targets.forEach((t) => (t.dataset.cine = 'wait'));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.cine = 'in';
          io.unobserve(e.target);
        }),
      {rootMargin: '0px 0px -8% 0px'}
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [motion]);

  return (
    <div className='pp-cinepage' ref={root}>
      <div className='pp-cinepage__band' style={{height: headH || undefined}} aria-hidden='true'>
        <Scene kind='ridges' className='pp-scene--page' sun={TRAITS[0].color} sunX={1110} sunY={175} sunFront />
      </div>
      {children}
    </div>
  );
};

export default CinePage;
