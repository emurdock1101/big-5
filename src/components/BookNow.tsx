import {Grid, Typography, makeStyles, Box, Button} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {Facebook, Instagram, Twitter} from '@material-ui/icons';

interface BookNowProps {}

const BookNow: React.FC<BookNowProps> = (props: BookNowProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
  const useStyles = makeStyles((theme) => ({
    expert: {
      fontSize: isMobile ? 30 : 40,
    },
    spacing: {
      textAlign: 'center',
      paddingTop: 160,
      paddingBottom: 100,
    },
    box: {
      borderTop: `1px solid ${theme.palette.info.main}`,
      color: theme.palette.info.main,
    },
    bookNowLink: {
      textDecoration: 'none',
      color: '#F8F7F3', //off-white
    },
    bookNowButton: {
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
      backgroundColor: theme.palette.primary.main,
      color: '#F8F7F3', //off-white
      width: '250px',
      height: '50px',
      borderRadius: '30px',
    },
    socialMedia: {
      marginTop: 60,
      textAlign: 'center',
    },
    facebook: {
      fontSize: 60,
      border: '1x solid red',
      '&:hover': {
        color: theme.palette.primary.main,
      },
      marginRight: 20,
      marginLeft: 20,
      color: theme.palette.info.main,
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
  });

  return (
    <Grid container justifyContent='center' alignItems='flex-start'>
      <Grid item xs={12}>
        <Box className={styles.box}>
          <div className={styles.spacing}>
            <Typography variant='h3' className={styles.expert}>
              Chat with an expert
            </Typography>
            <br></br>
            <br></br>
            <Grid container justifyContent='center' alignItems='flex-start'>
              <Grid item xs={10}>
                <Typography variant='h6'>
                  Schedule a FREE 15 minute discovery call to learn more about how you can benefit
                  from our behavioral coaching packages or how to review your Personality+ score.
                </Typography>
              </Grid>
            </Grid>
            <br></br>
            <br></br>
            <a
              href='https://calendly.com/discoverpersonalityplus'
              target='_blank'
              rel='noreferrer'
              className={styles.bookNowLink}>
              <Button variant='contained' className={styles.bookNowButton}>
                BOOK A CALL NOW
              </Button>
            </a>
            <div className={styles.socialMedia}>
              <a
                href='https://www.facebook.com/DiscoverPersonalityPlus/'
                target='_blank'
                rel='noreferrer'>
                <Facebook className={styles.facebook} />
              </a>
              <a
                href='https://instagram.com/discover_personalityplus'
                target='_blank'
                rel='noreferrer'>
                <Instagram className={styles.facebook} />
              </a>
              <a href='https://twitter.com/PersonalityB5' target='_blank' rel='noreferrer'>
                <Twitter className={styles.facebook} />
              </a>
            </div>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BookNow;
