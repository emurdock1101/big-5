import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';

import Percent from '../components/Percent';
import { getInterpretation } from '../utils/interpretations.utils';

export const useStyles = makeStyles((theme) => ({
  oceanScoreRow: {
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
  },
  aspectScoreRow: {
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
  },
  aspects: {
    paddingLeft: '30px',
  },
  gridContainer: {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '20px',
    color: theme.palette.info.main,
  },
  percent: {
    paddingLeft: '15px',
  },
}));

interface InterpretationsProps {
  oceanScore: number;
  oceanName: string;
  aspect1Score: number;
  aspect1Name: string;
  aspect2Score: number;
  aspect2Name: string;
  hex: string;
  index: number;
}

const Interpretations: React.FC<InterpretationsProps> = (props: InterpretationsProps) => {
  const styles = useStyles();

  return (
    <div>
      <Grid container className={styles.gridContainer}>
        <Grid item xs={9} sm={10} className={styles.oceanScoreRow}>
          <Typography variant='h5'>{props.oceanName}</Typography>
        </Grid>
        <Grid item xs={3} sm={2} className={styles.oceanScoreRow}>
          <Percent progress={props.oceanScore} hex={props.hex} size={90} />
        </Grid>
        <Grid item xs={12} sm={10}>
          <InterpretationList traitName={props.oceanName} score={props.oceanScore} indent={false} />
        </Grid>
        <Grid item xs={9} sm={10} className={styles.aspectScoreRow}>
          <Typography variant='h5' className={styles.aspects}>
            {props.aspect1Name}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={2} className={styles.aspectScoreRow}>
          <div className={styles.percent}>
            <Percent progress={props.aspect1Score} hex={props.hex} size={60} />
          </div>
        </Grid>
        <Grid item xs={12} sm={10}>
          <InterpretationList traitName={props.aspect1Name} score={props.aspect1Score} indent={true} />
        </Grid>
        <Grid item xs={9} sm={10} className={styles.aspectScoreRow}>
          <Typography variant='h5' className={styles.aspects}>
            {props.aspect2Name}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={2} className={styles.aspectScoreRow}>
          <div className={styles.percent}>
            <Percent progress={props.aspect2Score} hex={props.hex} size={60} />
          </div>
        </Grid>
        <Grid item xs={12} sm={10}>
          <InterpretationList traitName={props.aspect2Name} score={props.aspect2Score} indent={true} />
        </Grid>
      </Grid>
    </div>
  );
};

interface InterpretationListProps {
  traitName: string;
  score: number;
  indent: boolean;
}

export const InterpretationList: React.FC<InterpretationListProps> = ({ traitName, score, indent }) => {
  const interpretation = getInterpretation(traitName, score);

  if (!interpretation) return <React.Fragment />;

  return (
    <React.Fragment>
      {interpretation.paragraphs.map((paragraph, i) => (
        <React.Fragment key={i}>
          {i === 0 ? (
            <Typography variant='subtitle1' style={{ paddingLeft: indent ? 30 : 0 }}>
              <strong>{paragraph}</strong>
            </Typography>
          ) : (
            <React.Fragment>
              <br />
              <Typography variant='subtitle1' style={{ paddingLeft: indent ? 30 : 0 }}>
                {paragraph}
              </Typography>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default Interpretations;
