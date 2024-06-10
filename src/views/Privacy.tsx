import React from 'react';
import {Grid, Paper, Typography, makeStyles} from '@material-ui/core';

import Banner from '../components/Banner';
import {useEffect, useState} from 'react';

const Privacy: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
  const useStyles = makeStyles((theme) => ({
    info: {
      marginTop: 30,
      fontSize: 20,
    },
    top: {
      fontSize: 20,
    },
    paper: {
      padding: isMobile ? 20 : 30,
      color: theme.palette.info.main,
      borderLeft: `6px solid #111840`,
      borderRadius: 10,
    },
    footer: {
      bottom: 0,
      position: 'absolute',
      width: '100%',
    },
    container: {
      padding: 0,
    },
  }));
  const styles = useStyles();

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

  return (
    <React.Fragment>
      <Banner pageTitle='Privacy' />
      <Grid container justifyContent='center' alignItems='center' className={styles.container}>
        <Grid item xs={10}>
          <Paper elevation={2} className={styles.paper}>
            <Typography variant='subtitle1' className={styles.top}>
              Part of the information you share on our website is stored and used. We collect your email and test
              results. Your credit card info is collected by Stripe. Your browser info, IP address, and fingerprint are
              not stored.
            </Typography>
            <Typography variant='subtitle1' className={styles.info}>
              No personal data is sold or shared with anyone. Never have, never will.
            </Typography>
            <Typography variant='subtitle1' className={styles.info}>
              If you have any questions about this privacy policy, please reach out on our contact page.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Privacy;
