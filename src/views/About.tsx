import React from 'react';
import Banner from '../components/Banner';
import {about} from '../constants/content';
import patrick from '../images/patrick.jpeg';
import elliot from '../images/elliot.jpeg';

const About: React.FC = () => (
  <div className='pp'>
    <Banner pageTitle='Our team' intro='The man behind the test, and the engineer who built it.' />
    <div className='pp-wrap pp-team'>
      <section className='pp-member' aria-labelledby='patrick'>
        <img src={patrick} alt='Patrick Knicely' />
        <div className='pp-body' style={{display: 'grid', gap: 16, alignContent: 'start'}}>
          <h2 id='patrick' className='pp-display pp-h2'>
            Patrick Knicely
          </h2>
          <p className='pp-small' style={{margin: 0, fontWeight: 700}}>
            LPC · licensed teacher · biblical scholar
          </p>
          <p style={{margin: 0}}>{about.patrick.part1}</p>
          <p style={{margin: 0}}>{about.patrick.part2}</p>
        </div>
      </section>
      <section className='pp-member' aria-labelledby='elliot'>
        <img src={elliot} alt='Elliot Murdock' />
        <div className='pp-body' style={{display: 'grid', gap: 16, alignContent: 'start'}}>
          <h2 id='elliot' className='pp-display pp-h2'>
            Elliot Murdock
          </h2>
          <p className='pp-small' style={{margin: 0, fontWeight: 700}}>
            Software engineer
          </p>
          <p style={{margin: 0}}>{about.elliot.part1}</p>
          <p style={{margin: 0}}>{about.elliot.part2}</p>
          <p style={{margin: 0, display: 'flex', gap: 24, flexWrap: 'wrap'}}>
            <a href='https://github.com/emurdock1101' target='_blank' rel='noopener noreferrer'>
              GitHub
            </a>
            <a href='https://www.linkedin.com/in/elliot-murdock-675970161/' target='_blank' rel='noopener noreferrer'>
              LinkedIn
            </a>
            <a href='https://www.elliotchanningmurdock.com/' target='_blank' rel='noopener noreferrer'>
              Website
            </a>
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default About;
