import React from 'react';
import {Link} from 'react-router-dom';
import ColorPlate from '../design/ColorPlate';

/** 404: the page the visitor asked for doesn't exist. */
const ErrorPage: React.FC = () => (
  <div className='pp'>
    <div className='pp-wrap pp-lost'>
      <div className='pp-lost__plate' aria-hidden='true'>
        <ColorPlate scores={[50, 50, 50, 50, 50]} label='' />
      </div>
      <div className='pp-lost__copy'>
        <h1 className='pp-display pp-h1'>This page isn’t here.</h1>
        <p className='pp-lede'>The link may be old, or the address mistyped. Sorry about that.</p>
        <div className='pp-hero__actions'>
          <Link to='/' className='pp-btn'>
            Go to the homepage
          </Link>
          <Link to='/login' className='pp-textlink'>
            Log in to your results
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default ErrorPage;
