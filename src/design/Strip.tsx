import React from 'react';
import {TRAITS} from './traits';

/** The five trait colors as one strip, always in order. Decorative. */
const Strip: React.FC<{className?: string}> = ({className}) => (
  <div className={`pp-strip${className ? ' ' + className : ''}`} aria-hidden='true'>
    {TRAITS.map((t) => (
      <span key={t.ocean} style={{background: t.color}} />
    ))}
  </div>
);

export default Strip;
