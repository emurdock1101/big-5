import React, {useEffect, useRef, useState} from 'react';
import Scene from '../design/Scene';
import {TRAITS} from '../design/traits';

/*
 * Wraps an existing page in the cinematic look without editing the page itself.
 * - Default: a night band with drawn mountains and a red sun sits behind the page's title block
 *   (.pp-pagehead), and the sections below rise in as they scroll into view. Pages that change
 *   steps inside (the test) are re-measured, so the band only shows when a title block is there.
 * - full: the whole page is one night room with the mountains along the bottom (sign-in pages,
 *   the 404). Forms stay on their light sheets.
 */

const CinePage: React.FC<{children: React.ReactNode; full?: boolean}> = ({children, full = false}) => {
  const root = useRef<HTMLDivElement>(null);
  const [headH, setHeadH] = useState(0);
  const [motion] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // The night band follows the title block's height (re-checked whenever the page changes size).
  useEffect(() => {
    const el = root.current;
    if (!el || full) return;
    const measure = () => {
      const head = el.querySelector<HTMLElement>('.pp-pagehead');
      setHeadH(head ? head.offsetTop + head.offsetHeight : 0);
    };
    measure();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [full]);

  // Sections below the title rise in as they arrive.
  useEffect(() => {
    const el = root.current;
    if (!el || full || !motion || !('IntersectionObserver' in window)) return;
    const targets = Array.from(
      el.querySelectorAll<HTMLElement>('.pp-wrap:not(.pp-pagehead) > *, .pp-faq > li')
    ).filter((t) => !t.closest('.pp-pagehead') && t.getBoundingClientRect().top > window.innerHeight * 0.9);
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
    return () => {
      io.disconnect();
      targets.forEach((t) => delete t.dataset.cine);
    };
  }, [full, motion]);

  const scene = (
    <Scene
      kind='ridges'
      className={full ? 'pp-scene--room' : 'pp-scene--page'}
      sun={TRAITS[0].color}
      sunX={1110}
      sunY={175}
      sunFront
    />
  );

  return (
    <div className={`pp-cinepage${full ? ' pp-cinepage--full' : ''}`} ref={root}>
      {(full || headH > 0) && (
        <div className='pp-cinepage__band' style={full ? undefined : {height: headH}} aria-hidden='true'>
          {scene}
        </div>
      )}
      {children}
    </div>
  );
};

export default CinePage;
