import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, CircularProgress, Grid, makeStyles, Paper, Typography} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import type {ApexOptions} from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import Banner from '../components/Banner';
import Interpretations from '../components/Interpretations';
import ResultTable from '../components/ResultTable';
import {aspectOptions} from '../constants/aspectSpecs';
import {oceanOptions} from '../constants/oceanSpecs';
import {Aspect, Ocean} from '../constants/schema';
import {theme} from '../theme';

interface S3Results {
  name: string;
  gender: string;
  percentiles: Record<string, number>;
}

const useStyles = makeStyles(() => ({
  root: {
    padding: '24px',
  },
  backButton: {
    marginBottom: '16px',
  },
  error: {
    color: 'red',
    marginTop: '16px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
  interpretations: {
    marginBottom: '45px',
    borderRadius: 10,
  },
  interpretationTitle: {
    marginTop: 80,
  },
}));

const BASE_URL = process.env.REACT_APP_ADMIN_API_URL ?? '';

const AdminUserResults: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const {email, subId} = useParams<{email: string; subId: string}>();

  const [results, setResults] = useState<S3Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getAccessToken().getJwtToken();

        const params = new URLSearchParams({
          email: email ?? '',
          subId: subId ?? '',
        });

        const response = await fetch(`${BASE_URL}/admin/results?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? `Request failed: ${response.status}`);
        }

        const data: S3Results = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [email, subId]);

  const percentiles = results?.percentiles ?? {};

  const Extraversion: number = percentiles[Ocean.Extraversion] ?? 99;
  const Enthusiasm: number = percentiles[Aspect.Enthusiasm] ?? 99;
  const Assertiveness: number = percentiles[Aspect.Assertiveness] ?? 99;

  const Neuroticism: number = percentiles[Ocean.Neuroticism] ?? 99;
  const Withdrawal: number = percentiles[Aspect.Withdrawal] ?? 99;
  const Volatility: number = percentiles[Aspect.Volatility] ?? 99;

  const Agreeableness: number = percentiles[Ocean.Agreeableness] ?? 99;
  const Compassion: number = percentiles[Aspect.Compassion] ?? 99;
  const Politeness: number = percentiles[Aspect.Politeness] ?? 99;

  const Conscientiousness: number = percentiles[Ocean.Conscientiousness] ?? 99;
  const Industriousness: number = percentiles[Aspect.Industriousness] ?? 99;
  const Orderliness: number = percentiles[Aspect.Orderliness] ?? 99;

  const Openness: number = percentiles[Ocean.Openness] ?? 99;
  const AestheticOpenness: number = percentiles[Aspect.AestheticOpenness] ?? 99;
  const Interest: number = percentiles[Aspect.Interest] ?? 99;

  const aspectSeries = [
    {data: [Enthusiasm, Withdrawal, Compassion, Industriousness, AestheticOpenness]},
    {data: [Assertiveness, Volatility, Politeness, Orderliness, Interest]},
  ];

  const oceanSeries = [{data: [Extraversion, Neuroticism, Agreeableness, Conscientiousness, Openness]}];

  return (
    <div>
      <Banner pageTitle={`Results: ${email ?? ''}`} />
      <Grid container spacing={6} justifyContent='center' alignItems='flex-start' className={styles.root}>
        <Grid item xs={12} sm={11} lg={10}>
          <Button variant='outlined' className={styles.backButton} onClick={() => navigate('/admin')}>
            ← Back to Admin
          </Button>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <div className={styles.loadingContainer}>
              <CircularProgress />
            </div>
          </Grid>
        )}

        {!loading && error && (
          <Grid item xs={12} sm={11} lg={10}>
            <Typography variant='body1' className={styles.error}>
              {error}
            </Typography>
          </Grid>
        )}

        {!loading && !error && results && (
          <>
            <Grid item xs={12} sm={11} lg={10}>
              <Typography variant='h6'>
                <strong>Name:</strong> {results.name}
              </Typography>
              <Typography variant='h6'>
                <strong>Gender:</strong> {results.gender}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={11} lg={5}>
              <ResultTable percentiles={percentiles} />
            </Grid>
            <Grid item xs={12} sm={11} lg={5}>
              <Paper elevation={2} style={{borderRadius: '10px'}}>
                <ReactApexChart options={oceanOptions as ApexOptions} series={oceanSeries} type='bar' height={550} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={11} lg={5}>
              <Paper elevation={2} style={{borderRadius: '10px'}}>
                <ReactApexChart options={aspectOptions as ApexOptions} series={aspectSeries} type='bar' height={550} />
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
          </>
        )}
      </Grid>
    </div>
  );
};

export default AdminUserResults;
