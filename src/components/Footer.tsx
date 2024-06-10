import {Box, Grid, Typography, makeStyles} from '@material-ui/core';
import {useEffect, useState} from 'react';

const Footer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
  const useStyles = makeStyles((theme) => ({
    box: {
      borderTop: '1px solid lightGrey',
    },
    row: {
      display: 'flex',
      paddingTop: 30,
      paddingBottom: 30,
    },
    facebook: {
      fontSize: 32,
      '&:hover': {
        color: theme.palette.primary.main,
      },
      marginRight: 20,
      marginLeft: 20,
      color: '#111840',
    },
    copyright: {
      color: '#111840',
      textAlign: isMobile ? 'center' : 'right',
      padding: 20,
    },
    socialMedia: {
      width: isMobile ? '100%' : '80%',
      textAlign: isMobile ? 'center' : 'left',
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
          <Typography variant='subtitle1' className={styles.copyright}>
            © 2024 Personality+ All rights reserved.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Footer;
