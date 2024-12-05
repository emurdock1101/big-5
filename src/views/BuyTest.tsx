import {Button, Grid, Typography, makeStyles, Paper} from '@material-ui/core';
import {loadStripe} from '@stripe/stripe-js';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import Divider from '@mui/material/Divider';

export const useStyles = makeStyles((theme) => ({
  info: {
    padding: '15px',
    marginTop: 60,
  },
  buttons: {
    marginTop: 60,
  },
  button: {
    marginRight: 25,
    marginBottom: 50,
    padding: 15,
  },
  included: {
    fontWeight: 300,
    font: 'Monaco',
    marginBottom: 20,
  },
  paper: {
    padding: 30,
    borderRadius: 10,
  },
  listFirst: {
    marginTop: 20,
  },
  price: {
    color: theme.palette.primary.main,
  },
}));

const BuyTest: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const handleNav = (path: string) => {
    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
    navigate(path);
  };

  useEffect(() => {
    sessionStorage.clear();
    document?.querySelector('body')?.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  });

  const signUp = async (e: any) => {
    e.preventDefault();
    try {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY ?? '');

      if (stripe) {
        await stripe.redirectToCheckout({
          lineItems: [
            {
              price: process.env.REACT_APP_STRIPE_LINE_ITEM_PRICE,
              quantity: 1,
            },
          ],
          mode: 'payment',
          successUrl: (process.env.REACT_APP_DOMAIN ?? 'http://localhost:3000') + '/signup',
          cancelUrl: process.env.REACT_APP_DOMAIN ?? 'http://localhost:3000',
        });
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      handleNav('/checkouterror');
    }
  };

  return (
    <Grid container justifyContent='center' alignItems='center' spacing={2} className={styles.info}>
      <Grid item xs={12}>
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={12} md={10} lg={7}>
            <Paper elevation={2} className={styles.paper}>
              <Typography variant='h3' className={styles.included}>
                What's included for <span className={styles.price}>$9.99?</span>
              </Typography>
              <Divider />
              <Typography variant='subtitle1' className={styles.listFirst}>
                1. One copy of a 100-question, scientifically-backed, peer-reviewed assessment of personality.
              </Typography>
              <br></br>
              <Typography variant='subtitle1'>2. In-depth analysis of results, specific to your scores.</Typography>
              <br></br>
              <Typography variant='subtitle1'>3. Access to view your scores anytime.</Typography>
              <br></br>
              <Typography variant='subtitle1'>
                4. Discount offerings towards coaching services with Personality+ staff, where you can further learn
                about your behaviors and discover more about yourself.
              </Typography>
              <br></br>
              <br></br>
              <Typography variant='subtitle1'>
                Note: if you have purchased a Personality+ account before, you will have to provide a a different email
                to checkout.
              </Typography>
              <div className={styles.buttons}>
                <Button color='primary' variant='contained' onClick={signUp} className={styles.button}>
                  PURCHASE PERSONALITY+
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BuyTest;
