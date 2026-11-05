import * as React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
  const pct = Math.round(Math.max(0, Math.min(100, progress)));
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <div
        className='pp-scale__track'
        style={{flex: 1}}
        role='progressbar'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label='Test progress'>
        <span className='pp-scale__fill' style={{width: `${pct}%`, background: 'var(--pp-ink)'}} />
      </div>
      <span style={{fontWeight: 700, minWidth: '4ch', textAlign: 'right'}}>{pct}%</span>
    </div>
  );
};

export default ProgressBar;
