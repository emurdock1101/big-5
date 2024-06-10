import React from 'react';
import {Box, Typography, makeStyles} from '@material-ui/core';
import {useEffect, useState} from 'react';

import Divider from '@mui/material/Divider';

interface OceanBannerProps {
  ocean: string;
  aspect1: string;
  aspect2: string;
  hex: string;
}

const OceanBanner: React.FC<OceanBannerProps> = (props: OceanBannerProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 960);
  const useStyles = makeStyles((theme) => ({
    box: {
      alignItems: 'center',
    },
    aspects: {
      width: '20%',
      fontSize: 24,
      marginLeft: 20,
      marginRight: 10,
      fontWeight: 380,
    },
    aspectsBelow: {
      width: '50%',
      fontSize: isMobile ? 20 : 24,
      marginLeft: 10,
      marginRight: 10,
    },
    row: {
      display: 'flex',
      paddingRight: 20,
      alignItems: 'center',
      marginTop: 40,
    },
    title: {
      width: '50%',
      marginLeft: 20,
      fontWeight: 300,
      font: 'Monaco',
      fontSize: isMobile ? '35px' : '40px',
    },
    vertical: {
      backgroundColor: props.hex,
    },
  }));

  const styles = useStyles();

  // choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 960) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <Box className={styles.box}>
      {/* <Divider className={styles.divider} /> */}
      <div className={styles.row}>
        <Divider orientation='vertical' flexItem className={styles.vertical} />
        <Typography className={styles.title}>{props.ocean}</Typography>
        {!isMobile && <Divider orientation='vertical' flexItem className={styles.vertical} />}
        {!isMobile && <Typography className={styles.aspects}> {props.aspect1}</Typography>}
        {!isMobile && <Divider orientation='vertical' flexItem className={styles.vertical} />}
        {!isMobile && <Typography className={styles.aspects}>{props.aspect2}</Typography>}
      </div>

      {isMobile && (
        <React.Fragment>
          <div className={styles.row}>
            <Divider orientation='vertical' flexItem className={styles.vertical} />
            <Typography className={styles.aspectsBelow}> {props.aspect1}</Typography>
            <Divider orientation='vertical' flexItem className={styles.vertical} />
            <Typography className={styles.aspectsBelow}>{props.aspect2}</Typography>
          </div>
        </React.Fragment>
      )}
    </Box>
  );
};

export default OceanBanner;
