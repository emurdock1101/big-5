import {Button, Grid, Typography, makeStyles, Paper} from '@material-ui/core';
import {Storage} from '@aws-amplify/storage';
import {Auth} from 'aws-amplify';
import {getPercentiles} from '../util';
import {useNavigate} from 'react-router-dom';
import {Aspect, Ocean} from '../constants/schema';
import React from 'react';

export const useStyles = makeStyles((theme) => ({
  info: {
    padding: '15px',
    marginTop: 90,
  },
  buttons: {
    marginTop: 60,
  },
  buttonOne: {
    marginRight: 25,
    marginBottom: 30,
  },
  buttonTwo: {
    marginBottom: 30,
  },
  paper: {
    padding: 30,
    borderRadius: 10,
  },
}));

interface SubmitProps {
  prevStep: () => void;
  onComplete: () => void;
}

const Submit: React.FC<SubmitProps> = (props: SubmitProps) => {
  const navigate = useNavigate();
  const styles = useStyles();

  const processResults = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes.email;
    const subId: string = user.attributes.sub;
    const percentiles: Record<string, number> = getPercentiles();
    const name: string = sessionStorage.getItem('name') ?? 'name_unknown';
    const gender: string = sessionStorage.getItem('gender') ?? 'gender_unknown';
    const orderedPercentiles: Record<string, number> = {
      [Ocean.Extraversion]: percentiles[Ocean.Extraversion],
      [Aspect.Enthusiasm]: percentiles[Aspect.Enthusiasm],
      [Aspect.Assertiveness]: percentiles[Aspect.Assertiveness],

      [Ocean.Neuroticism]: percentiles[Ocean.Neuroticism],
      [Aspect.Withdrawal]: percentiles[Aspect.Withdrawal],
      [Aspect.Volatility]: percentiles[Aspect.Volatility],

      [Ocean.Agreeableness]: percentiles[Ocean.Agreeableness],
      [Aspect.Compassion]: percentiles[Aspect.Compassion],
      [Aspect.Politeness]: percentiles[Aspect.Politeness],

      [Ocean.Conscientiousness]: percentiles[Ocean.Conscientiousness],
      [Aspect.Industriousness]: percentiles[Aspect.Industriousness],
      [Aspect.Orderliness]: percentiles[Aspect.Orderliness],

      [Ocean.Openness]: percentiles[Ocean.Openness],
      [Aspect.AestheticOpenness]: percentiles[Aspect.AestheticOpenness],
      [Aspect.Interest]: percentiles[Aspect.Interest],
    };

    const testResultsObj = {
      name,
      gender,
      percentiles: orderedPercentiles,
    };

    Storage.configure({
      bucket: process.env.REACT_APP_BUCKET_NAME,
      region: 'us-east-1',
    });

    await Storage.put(`${email}-${subId}/${email}-results`, testResultsObj, {
      contentType: 'application/json',
    });

    props.onComplete();
    navigate('/results');
  };

  return (
    <React.Fragment>
      <Grid container justifyContent='center' alignItems='center' spacing={2} className={styles.info}>
        <Grid item xs={12}>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={10} lg={8}>
              <Paper elevation={2} className={styles.paper}>
                <Typography variant='h5'>You have completed the test.</Typography>
                <br></br>
                <Typography variant='subtitle1'>
                  If you are satisfied with your answers, submit below to see your results.
                </Typography>
                <div className={styles.buttons}>
                  <Button color='primary' variant='contained' onClick={processResults} className={styles.buttonOne}>
                    SUBMIT
                  </Button>
                  <Button color='default' variant='outlined' onClick={props.prevStep} className={styles.buttonTwo}>
                    BACK TO TEST
                  </Button>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Submit;
