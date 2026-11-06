import {createTheme} from '@material-ui/core/styles';

const font = "'Archivo', system-ui, sans-serif";

// Palette roles keep their trait meanings (charts and results read them).
export const theme = createTheme({
  palette: {
    error: {
      main: '#ED5362', // red -- Extraversion
    },
    warning: {
      main: '#9A338E', // purple -- Neuroticism
    },
    success: {
      main: '#3A81CD', // blue -- Agreeableness
    },
    primary: {
      main: '#00C9B7', // turquoise -- Conscientiousness
      contrastText: '#15172B',
    },
    secondary: {
      main: '#344B47', // dark green -- Openness
    },
    info: {
      main: '#15172B', // navy ink -- text
    },
    text: {
      primary: '#15172B',
      secondary: '#4A4C60',
    },
    background: {
      default: '#EBECED',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: font,
    button: {
      fontWeight: 700,
      textTransform: 'none',
      fontSize: '1rem',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 0,
        minHeight: 48,
        paddingLeft: 24,
        paddingRight: 24,
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {boxShadow: 'none'},
      },
      containedPrimary: {
        backgroundColor: '#15172B',
        color: '#FFFFFF',
        '&:hover': {backgroundColor: '#2A2D4A'},
      },
    },
    MuiPaper: {
      rounded: {borderRadius: 0},
    },
  },
});
