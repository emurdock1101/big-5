import React from 'react';
import Strip from '../design/Strip';

interface BannerProps {
  pageTitle: string;
  /** Optional one-line introduction under the title. */
  intro?: string;
  /** Render as a section heading (h2) instead of the page title (h1). */
  level?: 1 | 2;
}

/** Page heading: the title in wide display type over the five-color strip. */
const Banner: React.FC<BannerProps> = ({pageTitle, intro, level = 1}) => {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <div className='pp pp-wrap pp-pagehead'>
      <Strip />
      <Tag className={`pp-display ${level === 1 ? 'pp-h1' : 'pp-h2'}`}>{pageTitle}</Tag>
      {intro && <p className='pp-lede' style={{maxWidth: '52ch'}}>{intro}</p>}
    </div>
  );
};

export default Banner;
