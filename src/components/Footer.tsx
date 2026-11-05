import React from 'react';
import {Link} from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import {BOOKING_URL, CONTACT_EMAIL, SOCIAL} from '../design/traits';
import {Wordmark} from './HeaderDrawer';

const XIcon: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true' fill='currentColor'>
    <path d='M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z' />
  </svg>
);

const Footer: React.FC = () => (
  <footer className='pp pp-footer'>
    <div className='pp-wrap'>
      <div className='pp-footer__grid'>
        <div style={{display: 'grid', gap: 20, alignContent: 'start'}}>
          <Wordmark />
          <p style={{margin: 0, maxWidth: '36ch'}}>
            A Big Five personality test and report, built on published research and a therapist’s practice.
          </p>
          <div className='pp-social'>
            <a href={SOCIAL.facebook} target='_blank' rel='noopener noreferrer' aria-label='Personality+ on Facebook'>
              <FacebookIcon fontSize='small' />
            </a>
            <a href={SOCIAL.instagram} target='_blank' rel='noopener noreferrer' aria-label='Personality+ on Instagram'>
              <InstagramIcon fontSize='small' />
            </a>
            <a href={SOCIAL.x} target='_blank' rel='noopener noreferrer' aria-label='Personality+ on X'>
              <XIcon />
            </a>
          </div>
        </div>
        <div>
          <p className='pp-footer__h'>The test</p>
          <ul>
            <li>
              <Link to='/#how'>How it works</Link>
            </li>
            <li>
              <Link to='/#report'>Sample report</Link>
            </li>
            <li>
              <Link to='/buy'>Buy the test</Link>
            </li>
            <li>
              <Link to='/faqs'>FAQs</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className='pp-footer__h'>Personality+</p>
          <ul>
            <li>
              <Link to='/about'>About us</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
            <li>
              <a href={BOOKING_URL} target='_blank' rel='noopener noreferrer'>
                Book a free 15-minute call
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className='pp-footer__legal'>
        <span>© {new Date().getFullYear()} Personality+. All rights reserved.</span>
        <Link to='/privacy'>Privacy</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
