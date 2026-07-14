import React from 'react';
import {makeStyles, TextField, Button, Grid, Typography, Paper, Box} from '@material-ui/core';
import {useState} from 'react';
import {Auth} from 'aws-amplify';
import Banner from '../components/Banner';
import {useNavigate} from 'react-router-dom';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

interface ForgotProps {
  onLogIn: () => void;
}

const Forgot = (props: ForgotProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [alert, showAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const useStyles = makeStyles((theme) => ({
    plus: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.primary.dark,
      },
    },
    input: {
      minWidth: '100%',
      marginBottom: 30,
      marginTop: 30,
      paddingLeft: 20,
      paddingRight: 20,
    },
    button: {
      minWidth: '30%',
      margin: 20,
    },
    thirdTitle: {
      fontSize: 25,
      fontWeight: 300,
      font: 'Monaco',
      marginLeft: 20,
      marginTop: 30,
      marginBottom: 30,
    },
    paper: {
      padding: 20,
      marginBottom: 60,
      borderRadius: 10,
    },
    alert: {
      marginBottom: 15,
      border: '1px solid #EF5350',
    },
    box: {
      height: 50,
      marginBottom: 15,
    },
    forgot: {
      fontSize: 16,
      fontWeight: 300,
      font: 'Monaco',
      marginTop: 20,
      marginLeft: 20,
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.primary.dark,
      },
    },
    title: {
      minWidth: '100%',
      paddingLeft: 20,
      color: theme.palette.info.light,
    },
    password: {
      marginTop: 10,
      marginBottom: 10,
    },
  }));

  const styles = useStyles();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
    navigate(path, {replace: true});
  };

  const sendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showAlert(false);
    try {
      await Auth.forgotPassword(email);
      setCodeSent(true);
    } catch (error: unknown) {
      const err = error as {code?: string; log?: string};
      console.error(JSON.stringify(error));
      if (!email || !email.length) {
        setAlertContent('Registered email must be provided.');
      } else if (err.code === 'UserNotFoundException') {
        setAlertContent('User is not found. Try again with a registered email, or sign up below to create an account.');
      } else if (err.code?.length) {
        setAlertContent(err.code);
      } else if (err.log?.length) {
        setAlertContent(err.code ?? '');
      }
      showAlert(true);
    }
  };

  const reset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showAlert(false);
    try {
      const success = await Auth.forgotPasswordSubmit(email, code, password);

      if (success) {
        await Auth.signIn(email, password);
        props.onLogIn();
        handleNav('/');
      } else {
        setAlertContent('Password reset was not successful.');
        showAlert(true);
      }
    } catch (error: unknown) {
      const err = error as {code?: string; log?: string};
      console.error(JSON.stringify(error));
      if (!email || !email.length) {
        setAlertContent('Username must be provided.');
      } else if (!code || !code.length) {
        setAlertContent('Confirmation code must be provided.');
      } else if (!password || !password.length) {
        setAlertContent('Password must be provided.');
      } else if (err.code === 'InvalidPasswordException') {
        setAlertContent(
          'Invalid password. Make sure that you contain lowercase, uppercase, numerical, and special characters',
        );
      } else if (err.code?.length) {
        setAlertContent(err.code);
      } else if (err.log?.length) {
        setAlertContent(err.code ?? '');
      }
      showAlert(true);
    }
  };

  return (
    <React.Fragment>
      <Banner pageTitle='Reset Password' />
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item xs={10} md={7}>
          {alert ? (
            <Alert
              severity='error'
              className={styles.alert}
              onClose={() => {
                showAlert(false);
              }}>
              {alertContent}
            </Alert>
          ) : (
            <React.Fragment>
              <Box className={styles.box} />
            </React.Fragment>
          )}
          {!codeSent && (
            <Paper elevation={2} className={styles.paper}>
              <Typography variant='h5' className={styles.title}>
                Click to send a reset code to your email.
              </Typography>
              <form onSubmit={sendCode} noValidate>
                <TextField
                  id='forgot-email'
                  name='email'
                  type='email'
                  label='Email'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
                <Button type='submit' color='primary' variant='contained' className={styles.button}>
                  Send reset code
                </Button>
              </form>
            </Paper>
          )}
          {codeSent && (
            <Paper elevation={2} className={styles.paper}>
              <Grid container justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={6} className={styles.password}>
                  <Typography variant='h5' className={styles.title}>
                    Enter your reset code and your new password.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} className={styles.password}>
                  <Typography variant='subtitle1' className={styles.title}>
                    Your password must contain:
                  </Typography>
                  <List
                    sx={{
                      listStyleType: 'disc',
                      pl: 6,
                      '& .MuiListItem-root': {
                        display: 'list-item',
                      },
                    }}
                    className={styles.title}>
                    <ListItem>At least 1 lowercase letter</ListItem>
                    <ListItem>At least 1 uppercase letter</ListItem>
                    <ListItem>At least 1 number</ListItem>
                    <ListItem>At least 1 special character</ListItem>
                    <ListItem>At least 8 characters in length</ListItem>
                  </List>
                </Grid>
              </Grid>
              <form onSubmit={reset} noValidate>
                <TextField
                  id='forgot-code'
                  name='code'
                  type='text'
                  label='Reset Code'
                  autoComplete='one-time-code'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={styles.input}
                />
                <TextField
                  id='forgot-new-password'
                  name='password'
                  type='password'
                  label='New Password'
                  autoComplete='new-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />
                <Button type='submit' color='primary' variant='contained' className={styles.button}>
                  RESET PASSWORD
                </Button>
              </form>
            </Paper>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Forgot;
