import React from 'react';
import {Grid, Typography, makeStyles, Button} from '@material-ui/core';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Banner from '../components/Banner';

const CheckoutErrorPage: React.FC = () => {
  const useStyles = makeStyles((theme) => ({
    buttonContainer: {
      marginTop: 60,
      marginBottom: 60,
    },
    buttonItem: {
      textAlign: 'center',
    },
    info: {
      textAlign: 'center',
    },
  }));
  const styles = useStyles();

  const navigate = useNavigate();
  const handleNav = (path: string) => {
    navigate(path, {replace: true});
  };

  useEffect(() => {
    document?.querySelector('body')?.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);

  return (
    <React.Fragment>
      <Banner pageTitle='Checkout Error' />
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item xs={10} className={styles.info}>
          <Typography variant='h5'>
            Something went wrong with processing your payment. If you have created an account with us before using the
            same email, that could be the issue.
          </Typography>
          <br></br>
          <br></br>
          <Typography variant='h5'>
            Click below to return home or select the Contact us page from the sidebar.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent='center' alignItems='center' className={styles.buttonContainer}>
            <Grid item xs={4} sm={2} className={styles.buttonItem}>
              <Button color='default' variant='contained' onClick={() => handleNav('/')}>
                Go to home
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CheckoutErrorPage;
