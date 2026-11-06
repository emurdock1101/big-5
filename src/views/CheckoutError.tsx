import React from 'react';
import {Link} from 'react-router-dom';
import Strip from '../design/Strip';
import {CONTACT_EMAIL} from '../design/traits';

const CheckoutErrorPage: React.FC = () => (
  <div className='pp'>
    <div className='pp-wrap pp-pagehead' style={{paddingBottom: 'clamp(72px, 10vw, 140px)'}}>
      <Strip />
      <h1 className='pp-display pp-h1'>Checkout didn’t start.</h1>
      <p className='pp-lede' style={{maxWidth: '54ch'}}>
        Something went wrong while starting your payment. If an account already exists for that email, that may be
        the cause: each purchase needs its own email address.
      </p>
      <div className='pp-hero__actions' style={{marginTop: 8}}>
        <Link to='/buy' className='pp-btn'>
          Try again
        </Link>
        <Link to='/login' className='pp-textlink'>
          Already have an account? Log in
        </Link>
      </div>
      <p className='pp-small'>
        Still stuck? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we’ll sort it out.
      </p>
    </div>
  </div>
);

export default CheckoutErrorPage;
