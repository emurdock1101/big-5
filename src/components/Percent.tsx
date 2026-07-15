import * as React from 'react';

import CircularProgress, {CircularProgressProps, circularProgressClasses} from '@mui/material/CircularProgress';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';

function CircularProgressWithLabel(props: CircularProgressProps & {value: number; hex: string}) {
  return (
    <Box sx={{position: 'relative', display: 'inline-flex'}}>
      <CircularProgress variant='determinate' {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Typography
          variant={props.size === 60 ? 'h6' : 'h5'}
          component='div'
          color='text.secondary'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface PercentProps {
  progress: number;
  hex: string;
  size: number;
}

const Percent: React.FC<PercentProps> = (props: PercentProps) => {
  const PercentProgress = styled(CircularProgressWithLabel)(({theme}) => ({
    [`&.${circularProgressClasses.circle}`]: {
      backgroundColor: '#757575',
    },
    color: props.hex,
  }));

  return <PercentProgress value={props.progress} hex={props.hex} size={props.size} />;
};

export default Percent;
