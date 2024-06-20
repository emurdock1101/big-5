// React
import React, {useEffect, useState, createContext} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
// Material UI
import {makeStyles} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './theme';
// Views
import About from './views/About';
import Contact from './views/Contact';
import FAQs from './views/Faqs';
import ErrorPage from './views/Error';
import Home from './views/Home';
import Privacy from './views/Privacy';
import Quiz from './views/Quiz';
import Results from './views/Results';
import BuyTest from './views/BuyTest';
import Submit from './views/Submit';
import CheckoutErrorPage from './views/CheckoutError';
import Login from './views/Login';
import Signup from './views/Signup';
import Forgot from './views/Forgot';
// Components
import ProtectedRoute from './components/ProtectedRoute';
import HeaderDrawer from './components/HeaderDrawer';
import Footer from './components/Footer';
// Styling
import './App.css';
import '@aws-amplify/ui-react/styles.css';
// AWS
import {Amplify, Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import {Storage} from '@aws-amplify/storage';
// Utils & Constants
import {questionData as qd} from './constants/questionData';
import {User} from './constants/schema';
import {shuffle} from './util';

Amplify.configure(awsconfig);

export const UserContext = createContext<any>({});

const useStyles = makeStyles((theme) => ({
  footer: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  container: {
    minHeight: '100vh' /* will cover the 100% of viewport */,
    display: 'block',
    position: 'relative',
    paddingBottom: 120,
  },
}));

function App() {
  const styles = useStyles();
  const questionData = shuffle(qd);
  const [user, setUser] = useState<User>({
    loggedIn: false,
    completed: false,
  });
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  // Check Cognito for user
  useEffect(() => {
    assessLoggedInState();
    //eslint-disable-next-line
  }, []);

  // Check S3 for user results
  useEffect(() => {
    const fetchResultsFromS3 = async (): Promise<void> => {
      if (!user.loggedIn) return;

      const cognitoUser = await Auth.currentAuthenticatedUser();
      const email: string = cognitoUser.attributes?.email;
      const subId: string = cognitoUser.attributes?.sub;

      Storage.configure({
        bucket: process.env.REACT_APP_BUCKET_NAME,
        region: 'us-east-1',
      });

      let response;

      try {
        const url: string = await Storage.get(`${email}-${subId}/${email}-results`);
        response = await fetch(url);
        const responseData = await response.json();

        if (responseData && Object.keys(responseData).length > 0) {
          setUser({...user, completed: true});
        } else {
          setUser({...user, completed: false});
        }
      } catch (error) {
        console.error('Fetch error: ', response?.status, response?.statusText);
        setUser({...user, completed: false});
      } finally {
        setLoading(false); // Set loading to false after fetching results
      }
    };

    fetchResultsFromS3();
    //eslint-disable-next-line
  }, [loggedIn]);

  const completeTest = () => {
    setUser({...user, completed: true});
  };

  const assessLoggedInState = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setUser({...user, loggedIn: true});
      setLoggedIn(true);
    } catch (error) {
      setUser({...user, loggedIn: false});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <React.Fragment />;
  }

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{user, setUser}}>
        <div className={styles.container}>
          <HeaderDrawer loggedIn={!!user.loggedIn} completed={!!user.completed} onLogOut={assessLoggedInState} />
          <Routes>
            <Route
              path='/test'
              element={
                <ProtectedRoute
                  type={'loggedInAndUncompleted'}
                  component={<Quiz onComplete={completeTest} questionData={questionData} />}
                />
              }
            />
            <Route
              path='/submit'
              element={
                <ProtectedRoute
                  type={'loggedInAndUncompleted'}
                  component={<Submit onComplete={() => {}} prevStep={() => {}} />}
                />
              }
            />
            <Route path='/results' element={<ProtectedRoute type={'loggedInAndCompleted'} component={<Results />} />} />
            <Route
              path='/reset'
              element={<ProtectedRoute type={'loggedOut'} component={<Forgot onLogIn={assessLoggedInState} />} />}
            />
            <Route
              path='/login'
              element={<ProtectedRoute type={'loggedOut'} component={<Login onLogIn={assessLoggedInState} />} />}
            />
            <Route
              path='/signup'
              element={<ProtectedRoute type={'loggedOut'} component={<Signup onLogIn={assessLoggedInState} />} />}
            />
            <Route path='/buy' element={<ProtectedRoute type={'loggedOut'} component={<BuyTest />} />} />

            <Route path='/' element={<Home loggedIn={!!user.loggedIn} completed={!!user.completed} />} />
            <Route path='/about' element={<About />} />
            <Route path='/faqs' element={<FAQs />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/error' element={<ErrorPage />} />
            <Route path='/checkouterror' element={<CheckoutErrorPage />} />
            <Route path='*' element={<Navigate to='/error' replace />} />
          </Routes>
          <div className={styles.footer}>
            <Footer />
          </div>
        </div>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
