import React from 'react';
import {Grid, Typography, makeStyles} from '@material-ui/core';

import Percent from '../components/Percent';
import interpretations from '../constants/interpretations';
import {scoreAdjective} from '../util';

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
          <InterpretationList type='category' score={props.oceanScore} index={props.index} />
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
          <InterpretationList type='aspect1' score={props.aspect1Score} index={props.index} />
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
          <InterpretationList type='aspect2' score={props.aspect2Score} index={props.index} />
        </Grid>
      </Grid>
    </div>
  );
};

interface InterpretationListProps {
  score: number;
  type: 'category' | 'aspect1' | 'aspect2';
  index: number;
}

export default Interpretations;

export const InterpretationList: React.FC<InterpretationListProps> = (props: InterpretationListProps) => {
  const scoredSection: string = interpretations[props.index][props.type][scoreAdjective(props.score)];

  return (
    <React.Fragment>
      {Object.keys(scoredSection).map((part: any) => {
        // add bold and don't include line break if part 1
        if (part === 'part1') {
          return (
            <React.Fragment>
              <Typography variant='subtitle1' style={{paddingLeft: props.type !== 'category' ? 30 : 0}}>
                <strong>{interpretations[props.index][props.type][scoreAdjective(props.score)][part]}</strong>
              </Typography>
            </React.Fragment>
          );
        } else if (scoredSection[part]) {
          return (
            <React.Fragment>
              <br></br>
              <Typography variant='subtitle1' style={{paddingLeft: props.type !== 'category' ? 30 : 0}}>
                {interpretations[props.index][props.type][scoreAdjective(props.score)][part]}
              </Typography>
            </React.Fragment>
          );
        } else {
          return <React.Fragment></React.Fragment>;
        }
      })}
    </React.Fragment>
  );
};
