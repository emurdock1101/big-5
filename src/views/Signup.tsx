import {makeStyles, TextField, Button, Grid, Typography, Paper, Box} from '@material-ui/core';
import {useState} from 'react';
import {Auth} from 'aws-amplify';
import Banner from '../components/Banner';
import {useNavigate} from 'react-router-dom';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';

interface SignupProps {
  onLogIn: () => void;
}

const Signup = (props: SignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, showAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [user, setUser] = useState<unknown>(undefined);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const useStyles = makeStyles((theme) => ({
    plus: {
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
    input: {
      minWidth: '100%',
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

  const signUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    showAlert(false);
    try {
      const userCognito = await Auth.signIn(email, password);
      setUser(userCognito);
    } catch (error: unknown) {
      const err = error as { code?: string; log?: string };
      console.error(JSON.stringify(error));
      if (!email || !email.length) {
        setAlertContent('Username must be provided.');
      } else if (!password || !password.length) {
        setAlertContent('Password must be provided.');
      } else if (err.code === 'UserNotFoundException') {
        setAlertContent(
          'User is not found. Try again with the correct credentials, or sign up below to create an account.',
        );
      } else if (err.code === 'NotAuthorizedException') {
        setAlertContent('Incorrect password or email.');
      } else if (err.code?.length) {
        setAlertContent(err.code);
      } else if (err.log?.length) {
        setAlertContent(err.code ?? '');
      }
      showAlert(true);
    }
  };

  const register = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    showAlert(false);
    try {
      if (newPassword !== newPasswordConfirm) {
        setAlertContent('Passwords do not match.');
        showAlert(true);
      } else {
        await Auth.completeNewPassword(
          user, // the Cognito User Object
          newPassword, // the new password
        );

        props.onLogIn();
        handleNav('/test');
      }
    } catch (error: unknown) {
      const err = error as { code?: string; log?: string };
      console.error(JSON.stringify(error));
      if (!newPassword || !newPassword.length || !newPasswordConfirm || !newPasswordConfirm.length) {
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
      <Banner pageTitle='Register' />
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
          {!user && (
            <Paper elevation={2} className={styles.paper}>
              <Typography variant='h5' className={styles.title}>
                Check your email for your temporary password.
              </Typography>
              <TextField
                type='text'
                placeholder='email'
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <TextField
                type='password'
                placeholder='temporary password'
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <br></br>
              <br></br>
              <Button color='primary' variant='contained' onClick={signUp} className={styles.button}>
                SIGN UP
              </Button>
            </Paper>
          )}
          {user && (
            <Paper elevation={2} className={styles.paper}>
              <Grid container justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={6} className={styles.password}>
                  <Typography variant='h5' className={styles.title}>
                    Create your account password.
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
              <TextField
                type='password'
                placeholder='new password'
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
              />
              <TextField
                type='password'
                placeholder='confirm password'
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                className={styles.input}
              />
              <Button color='primary' variant='contained' onClick={register} className={styles.button}>
                CREATE PASSWORD
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Signup;
