import {Button, Grid, Paper, makeStyles} from '@material-ui/core';

import ProgressBar from '../components/ProgressBar';
import {Question} from '../constants/schema';
import QuestionComp from './QuestionComp';
import {useState, useEffect} from 'react';
import React from 'react';

export const useStyles = makeStyles((theme) => ({
  pageNav: {
    textAlign: 'center',
  },
  homeLink: {
    textAlign: 'center',
    marginTop: 60,
  },
  linkText: {
    color: theme.palette.success.main,
    '&:hover': {
      color: theme.palette.success.dark,
    },
    textDecoration: 'underline',
    fontSize: 18,
  },
  row: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  paper: {
    padding: 15,
    borderRadius: 10,
  },
  link: {
    textDecoration: 'none',
  },
  container: {
    padding: 15,
  },
}));
interface QuestionPackProps {
  totalQuestions: number;
  questions: Question[];
  page: number;
  prevStep: () => void;
  nextStep: () => void;
}

const QuestionPack: React.FC<QuestionPackProps> = (props: QuestionPackProps) => {
  const styles = useStyles();
  const numberOfPages = props.totalQuestions / props.questions.length;
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const countAnswer = (uid: string) => {
    if (!answeredQuestions.includes(uid)) {
      setAnsweredQuestions([...answeredQuestions, uid]);
    }
  };

  useEffect(() => {
    document?.querySelector('body')?.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);

  return (
    <div>
      <Grid container justifyContent='center' alignItems='center' className={styles.container}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12} className={styles.row}>
          <ProgressBar
            progress={
              (((props.page - 1) * props.questions.length + answeredQuestions.length) / props.totalQuestions) * 100
            }
          />
        </Grid>
        <Grid item xs={3} sm={2} md={1} className={styles.pageNav}>
          <Button disabled={props.page === 1} color='default' variant='outlined' onClick={props.prevStep}>
            PREV
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} md={2} className={styles.pageNav}>
          <p>
            Page {props.page} of {numberOfPages}
          </p>
        </Grid>
        <Grid item xs={3} sm={2} md={1} className={styles.pageNav}>
          <Button
            disabled={answeredQuestions.length !== props.questions.length}
            color='default'
            variant='outlined'
            onClick={props.nextStep}>
            NEXT
          </Button>
        </Grid>

        {props.questions.map((question) => {
          return (
            <Grid item xs={12} className={styles.row}>
              <Paper elevation={2} className={styles.paper}>
                <QuestionComp question={question} countAnswer={countAnswer} />
              </Paper>
            </Grid>
          );
        })}
        <Grid item xs={3} sm={2} md={1} className={styles.pageNav}>
          <Button disabled={props.page === 1} color='default' variant='outlined' onClick={props.prevStep}>
            PREV
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} md={2} className={styles.pageNav}>
          <p>
            Page {props.page} of {numberOfPages}
          </p>
        </Grid>
        <Grid item xs={3} sm={2} md={1} className={styles.pageNav}>
          <Button
            disabled={answeredQuestions.length !== props.questions.length}
            color='default'
            variant='outlined'
            onClick={props.nextStep}>
            NEXT
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default QuestionPack;
