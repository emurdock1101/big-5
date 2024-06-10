import React from 'react';
import {Facebook, Instagram, Mail, Twitter} from '@material-ui/icons';
import {Grid, Paper, Typography, Button, makeStyles} from '@material-ui/core';
import {useEffect, useState} from 'react';

import Banner from '../components/Banner';

const Contact: React.FC = () => {
  const useStyles = makeStyles((theme) => ({
    facebook: {
      fontSize: isMobile ? 37 : 45,
      '&:hover': {
        color: theme.palette.primary.main,
      },
      marginRight: isMobile ? 30 : 60,
      color: theme.palette.info.main,
    },
    help: {
      fontSize: isMobile ? 20 : 25,
      marginBottom: 30,
    },
    reachOut: {
      fontSize: isMobile ? 17 : 20,
    },
    socialLinks: {
      marginLeft: -10,
      marginTop: 60,
    },
    paper: {
      padding: isMobile ? 20 : 30,
      color: theme.palette.info.main,
      borderLeft: `6px solid #111840`,
      borderRadius: 10,
    },
    bookNowButton: {
      '&:hover': {
        backgroundColor: theme.palette.info.main,
      },
      backgroundColor: theme.palette.primary.main,
      color: '#F8F7F3', //off-white
      width: '250px',
      height: '50px',
      borderRadius: '30px',
      marginTop: 30,
    },
    bookNowLink: {
      textDecoration: 'none',
      color: '#F8F7F3', //off-white
    },
    email: {
      fontWeight: 600,
    },
  }));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);

  // choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 750) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    document?.querySelector('body')?.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);

  const styles = useStyles();
  return (
    <React.Fragment>
      <Banner pageTitle='Contact Us' />
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item xs={10}>
          <Paper elevation={2} className={styles.paper}>
            <Typography variant='h5' className={styles.help}>
              How can we help?
            </Typography>
            <Typography variant='subtitle1' className={styles.reachOut}>
              Ask about the Personality+ test or our data-driven psychological coaching services:{' '}
              <span className={styles.email}>discoverpersonalityplus@gmail.com</span>
            </Typography>
            <Typography variant='subtitle1' className={styles.reachOut}>
              Schedule a FREE 15 minute discovery call to learn more about how you can benefit from our behavioral
              coaching packages or how to review your Personality+ score.
            </Typography>
            <a
              href='https://calendly.com/discoverpersonalityplus'
              target='_blank'
              rel='noreferrer'
              className={styles.bookNowLink}>
              <Button variant='contained' className={styles.bookNowButton}>
                BOOK A CALL NOW
              </Button>
            </a>
            <div className={styles.socialLinks}>
              <a href='https://www.facebook.com/DiscoverPersonalityPlus/' target='_blank' rel='noreferrer'>
                <Facebook className={styles.facebook} />
              </a>
              <a href='https://instagram.com/discover_personalityplus' target='_blank' rel='noreferrer'>
                <Instagram className={styles.facebook} />
              </a>
              <a href='https://twitter.com/PersonalityB5' target='_blank' rel='noreferrer'>
                <Twitter className={styles.facebook} />
              </a>
              <a href='mailto:discoverpersonalityplus@gmail.com'>
                <Mail className={styles.facebook} />
              </a>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Contact;
