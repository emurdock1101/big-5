import * as React from 'react';

import LinearProgress, {LinearProgressProps, linearProgressClasses} from '@mui/material/LinearProgress';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {theme as thm} from '../theme';

const BorderLinearProgress = styled(LinearProgressWithLabel)(({theme}) => ({
  height: 12,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#757575',
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: thm.palette.primary.main,
  },
}));

function LinearProgressWithLabel(props: LinearProgressProps & {value: number}) {
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Box sx={{width: '100%', mr: 1}}>
        <LinearProgress variant='determinate' {...props} color='primary' />
      </Box>
      <Box sx={{minWidth: 35}}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = (props: ProgressBarProps) => {
  // const [progress, setProgress] = React.useState(10);

  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return <BorderLinearProgress value={props.progress} />;
};

export default ProgressBar;
