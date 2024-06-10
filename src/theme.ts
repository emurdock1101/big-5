import {createTheme} from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    error: {
      main: '#ED5362', // red -- Extraversion
    },
    warning: {
      main: '#9A338E', // purple -- Neuroticism
    },
    success: {
      main: '#3A81CD', // blue -- Agreeablenesss
    },
    primary: {
      main: '#00C9B7', // turquoise -- Conscientiousness
    },
    secondary: {
      main: '#344B47', // dark green -- Openness
    },
    info: {
      main: '#1b1d21', // black -- normal text
    },
  },
});
