import {Aspect, Ocean} from '../constants/schema';
import {Grid, Paper, Typography, makeStyles, Button} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {Storage} from '@aws-amplify/storage';
import Banner from '../components/Banner';
import BookNow from '../components/BookNow';
import Interpretations from '../components/Interpretations';
import OceanAccordion from '../components/OceanAccordion';
import ReactApexChart from 'react-apexcharts';
import ResultTable from '../components/ResultTable';
import {aspectOptions} from '../constants/aspectSpecs';
import {oceanOptions} from '../constants/oceanSpecs';
import {theme} from '../theme';
import {Auth} from 'aws-amplify';
import React from 'react';
import {generatePdfDoc} from '../util';

interface S3Results {
  name: string;
  gender: string;
  // school?: string;
  percentiles: Record<string, number>;
}

const Results: React.FC = () => {
  const [percentiles, setPercentiles] = useState<Record<string, number> | null>(null);
  const [gender, setGender] = useState('gender');

  const useStyles = makeStyles((theme) => ({
    info: {
      marginBottom: '20px',
      fontSize: 18,
      color: theme.palette.info.main,
    },
    explanation: {
      padding: '20px',
      marginBottom: '10px', //this needs change if anything changes - should line up with table
      borderRadius: 10,
    },
    interpretations: {
      marginBottom: '45px', //Not sure why this isn't the same pixel ratio as others
      borderRadius: 10,
    },
    titlePaper: {
      backgroundColor: '#111840', // navy blue
      minHeight: 200,
    },
    interpretationTitle: {
      marginTop: 80,
    },
    bookNowButton: {
      marginTop: 28,
      marginBottom: 28, // lines up with table results on xl screen
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.info.main,
      },
      color: theme.palette.common.white,
      width: '200px',
      height: '40px',
      borderRadius: '20px',
    },
    bookNowLink: {
      textDecoration: 'none',
      color: theme.palette.common.white,
    },
    footer: {
      marginTop: 40,
      width: '100%',
    },
    downloadButton: {
      width: '100%',
      color: '111840', //navy,
      border: '1px solid #111840',
      borderRadius: 10,
      '&:hover': {
        color: '#F8F7F3', //off-white
        backgroundColor: '#111840', //navy blue
      },
    },
  }));

  const styles = useStyles();

  const downloadResults = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes?.email ?? '';

    generatePdfDoc(email, percentiles);
  };

  const getResultsFromS3 = async (): Promise<void> => {
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes?.email ?? 'email_unknown';
    const subId: string = user.attributes?.sub ?? 'subId_unknown';

    Storage.configure({
      bucket: process.env.REACT_APP_BUCKET_NAME,
      region: 'us-east-1',
    });

    const url: string = await Storage.get(`${email}-${subId}/${email}-results`);
    const dataWithUserInfo: S3Results = await fetch(url).then((response) => response.json());
    setGender(dataWithUserInfo.gender);
    setPercentiles(dataWithUserInfo.percentiles);
  };

  useEffect(() => {
    getResultsFromS3();
  }, []);

  const Extraversion: number = percentiles?.[`${Ocean.Extraversion.toString()}`] ?? 99;
  const Enthusiasm: number = percentiles?.[`${Aspect.Enthusiasm.toString()}`] ?? 99;
  const Assertiveness: number = percentiles?.[`${Aspect.Assertiveness.toString()}`] ?? 99;

  const Neuroticism: number = percentiles?.[`${Ocean.Neuroticism.toString()}`] ?? 99;
  const Withdrawal: number = percentiles?.[`${Aspect.Withdrawal.toString()}`] ?? 99;
  const Volatility: number = percentiles?.[`${Aspect.Volatility.toString()}`] ?? 99;

  const Agreeableness: number = percentiles?.[`${Ocean.Agreeableness.toString()}`] ?? 99;
  const Compassion: number = percentiles?.[`${Aspect.Compassion.toString()}`] ?? 99;
  const Politeness: number = percentiles?.[`${Aspect.Politeness.toString()}`] ?? 99;

  const Conscientiousness: number = percentiles?.[`${Ocean.Conscientiousness.toString()}`] ?? 99;
  const Industriousness: number = percentiles?.[`${Aspect.Industriousness.toString()}`] ?? 99;
  const Orderliness: number = percentiles?.[`${Aspect.Orderliness.toString()}`] ?? 99;

  const Openness: number = percentiles?.[`${Ocean.Openness.toString()}`] ?? 99;
  const AestheticOpenness: number = percentiles?.[`${Aspect.AestheticOpenness.toString()}`] ?? 99;
  const Interest: number = percentiles?.[`${Aspect.Interest.toString()}`] ?? 99;

  // data for aspects chart
  const aspectSeries = [
    {
      data: [Enthusiasm, Withdrawal, Compassion, Industriousness, AestheticOpenness],
    },
    {
      data: [Assertiveness, Volatility, Politeness, Orderliness, Interest],
    },
  ];

  // data for ocean chart
  const oceanSeries = [
    {
      data: [Extraversion, Neuroticism, Agreeableness, Conscientiousness, Openness],
    },
  ];

  const genderedResults = gender === 'male' ? 'males' : 'females';

  return (
    <div>
      <Banner pageTitle='Results and Explanation' />
      <Grid container spacing={6} justifyContent='center' alignItems='flex-start'>
        <Grid item xs={12} sm={11} lg={10}>
          <Button variant='outlined' className={styles.downloadButton} onClick={downloadResults}>
            DOWNLOAD RESULTS
          </Button>
        </Grid>
        <Grid item xs={12} sm={11} lg={5}>
          <Paper elevation={2} className={styles.explanation}>
            <Typography variant='subtitle1' className={styles.info}>
              Your results are shown in the table and in the bar charts below.{' '}
            </Typography>
            <Typography variant='subtitle1' className={styles.info}>
              Remember that each personality trait and aspect and your relative position with respect to them has
              advantages and disadvantages. It is for that reason that variation exists in the human population: there
              is a niche for each personality configuration. Much of what constitutes success in life is therefore the
              consequence of finding the place in relationships, work and personal commitment that corresponds to your
              unique personality structure. Good luck with your personality journey!
            </Typography>
            <Typography variant='subtitle1' className={styles.info}>
              Note that if you find that the descriptions harsher than you might consider appropriate this may mean that
              you were more self-critical than necessary when completing the questions. Remember, the results are based
              on your own self-report, compared to that of other {genderedResults}. This can occur if you were feeling
              temporarily or chronically unhappy or anxious, or hungry, angry or judgmental when you completed the
              questions.
            </Typography>
            <Typography variant='subtitle1' className={styles.info}>
              <strong>
                To learn more about our behavioral coaching services, click to schedule a FREE 15 minute discovery call.
              </strong>
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
          </Paper>
        </Grid>
        <Grid item xs={12} sm={11} lg={5}>
          <ResultTable percentiles={percentiles ?? {}} />
        </Grid>
        <Grid item xs={12} sm={11} lg={10}>
          <OceanAccordion />
        </Grid>
        <Grid item xs={12} sm={11} lg={5}>
          <Paper elevation={2} style={{borderRadius: '10px'}}>
            <ReactApexChart options={oceanOptions} series={oceanSeries} type='bar' height={550} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={11} lg={5}>
          <Paper elevation={2} style={{borderRadius: '10px'}}>
            <ReactApexChart options={aspectOptions} series={aspectSeries} type='bar' height={550} />
          </Paper>
        </Grid>
        <Grid item xs={12} className={styles.interpretationTitle}>
          <Banner pageTitle='Interpretation of Results' />
        </Grid>
        <Grid item xs={12} sm={11} lg={10}>
          <Paper elevation={2} className={styles.interpretations}>
            <Interpretations
              oceanName={Ocean.Extraversion}
              oceanScore={Extraversion}
              aspect1Name={Aspect.Enthusiasm}
              aspect1Score={Enthusiasm}
              aspect2Name={Aspect.Assertiveness}
              aspect2Score={Assertiveness}
              hex={theme.palette.error.main}
              index={2}
            />
          </Paper>
          <Paper elevation={2} className={styles.interpretations}>
            <Interpretations
              oceanName={Ocean.Neuroticism}
              oceanScore={Neuroticism}
              aspect1Name={Aspect.Withdrawal}
              aspect1Score={Withdrawal}
              aspect2Name={Aspect.Volatility}
              aspect2Score={Volatility}
              hex={theme.palette.warning.main}
              index={4}
            />
          </Paper>
          <Paper elevation={2} className={styles.interpretations}>
            <Interpretations
              oceanName={Ocean.Agreeableness}
              oceanScore={Agreeableness}
              aspect1Name={Aspect.Compassion}
              aspect1Score={Compassion}
              aspect2Name={Aspect.Politeness}
              aspect2Score={Politeness}
              hex={theme.palette.success.main}
              index={3}
            />
          </Paper>
          <Paper elevation={2} className={styles.interpretations}>
            <Interpretations
              oceanName={Ocean.Conscientiousness}
              oceanScore={Conscientiousness}
              aspect1Name={Aspect.Industriousness}
              aspect1Score={Industriousness}
              aspect2Name={Aspect.Orderliness}
              aspect2Score={Orderliness}
              hex={theme.palette.primary.main}
              index={1}
            />
          </Paper>
          <Paper elevation={2} className={styles.interpretations}>
            <Interpretations
              oceanName={Ocean.Openness}
              oceanScore={Openness}
              aspect1Name={Aspect.AestheticOpenness}
              aspect1Score={AestheticOpenness}
              aspect2Name={Aspect.Interest}
              aspect2Score={Interest}
              hex={theme.palette.secondary.main}
              index={0}
            />
          </Paper>
        </Grid>
      </Grid>
      <div className={styles.footer}>
        <BookNow />
      </div>
    </div>
  );
};

export default Results;
