// React
import React, {useEffect, useState, useCallback, createContext, Suspense, lazy} from 'react';
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
import HomeCinematic from './views/HomeCinematic';
import CinePage from './views/CinePage';
import BuyTest from './views/BuyTest';
import CheckoutErrorPage from './views/CheckoutError';
// Components
import ProtectedRoute from './components/ProtectedRoute';
import HeaderDrawer from './components/HeaderDrawer';
import Footer from './components/Footer';
// Styling
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import './design/site.css';
import ScrollManager from './design/ScrollManager';
// AWS
import {Amplify, Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import {Storage} from '@aws-amplify/storage';
// Utils & Constants
import {questionData as qd} from './constants/questionData';
import {User} from './constants/schema';
import {shuffle} from './utils/array.utils';

// Routes loaded on demand, kept out of the first download
const AdminView = lazy(() => import('./views/AdminView'));
const AdminUserResults = lazy(() => import('./views/AdminUserResults'));
const Privacy = lazy(() => import('./views/Privacy'));
const Quiz = lazy(() => import('./views/Quiz'));
const Results = lazy(() => import('./views/Results'));
const Submit = lazy(() => import('./views/Submit'));
const Login = lazy(() => import('./views/Login'));
const Signup = lazy(() => import('./views/Signup'));
const Forgot = lazy(() => import('./views/Forgot'));
const ResultsPreview = lazy(() => import('./views/ResultsPreview'));
const TestPreview = lazy(() => import('./views/TestPreview'));
const Compare = lazy(() => import('./views/Compare'));
const ComparePreview = lazy(() => import('./views/ComparePreview'));
const GiftFinderPreview = lazy(() => import('./views/GiftFinderPreview'));

Amplify.configure(awsconfig);

export interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextType>({
  user: {loggedIn: false, completed: false},
  setUser: () => {},
});

const useStyles = makeStyles(() => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
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

  const assessLoggedInState = useCallback(async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const groups: string[] = cognitoUser.signInUserSession?.accessToken?.payload?.['cognito:groups'] ?? [];
      const isAdmin = groups.includes('admins');
      setUser((prev) => ({...prev, loggedIn: true, isAdmin}));
      setLoggedIn(true);
    } catch (error) {
      setUser((prev) => ({...prev, loggedIn: false, isAdmin: false}));
    } finally {
      setLoading(false);
    }
  }, []);

  // Check Cognito for user on mount
  useEffect(() => {
    assessLoggedInState();
  }, [assessLoggedInState]);

  // Check S3 for user results whenever loggedIn changes
  useEffect(() => {
    const fetchResultsFromS3 = async (): Promise<void> => {
      if (!loggedIn) return;

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
          setUser((prev) => ({...prev, completed: true}));
        } else {
          setUser((prev) => ({...prev, completed: false}));
        }
      } catch (error) {
        console.error('Fetch error: ', response?.status, response?.statusText);
        setUser((prev) => ({...prev, completed: false}));
      } finally {
        setLoading(false);
      }
    };

    fetchResultsFromS3();
  }, [loggedIn]);

  const completeTest = () => {
    setUser((prev) => ({...prev, completed: true}));
  };

  // Public pages render straight away; only account pages wait for the sign-in check.
  const publicPaths = ['/', '/results-preview', '/test-preview', '/compare-preview', '/gift-finder-preview', '/home-flow-preview', '/about', '/faqs', '/contact', '/buy', '/privacy', '/error', '/checkouterror'];
  if (loading && !publicPaths.includes(window.location.pathname)) {
    return <React.Fragment />;
  }

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{user, setUser}}>
        <div className={styles.container}>
          <HeaderDrawer
            loggedIn={!!user.loggedIn}
            completed={!!user.completed}
            isAdmin={!!user.isAdmin}
            onLogOut={assessLoggedInState}
          />
          <ScrollManager />
          <main id='main' className={styles.main}>
          <Suspense fallback={<div style={{minHeight: '60vh'}} />}>
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
            <Route path='/buy' element={<ProtectedRoute type={'loggedOut'} component={<CinePage><BuyTest /></CinePage>} />} />

            <Route path='/admin' element={<ProtectedRoute type={'admin'} component={<AdminView />} />} />
            <Route
              path='/admin/user/:email/:subId'
              element={<ProtectedRoute type={'admin'} component={<AdminUserResults />} />}
            />
            {process.env.NODE_ENV === 'development' && <Route path='/results-preview' element={<ResultsPreview />} />}
            {process.env.NODE_ENV === 'development' && <Route path='/test-preview' element={<TestPreview />} />}
            {process.env.NODE_ENV === 'development' && <Route path='/compare-preview' element={<ComparePreview />} />}
            {process.env.NODE_ENV === 'development' && <Route path='/gift-finder-preview' element={<GiftFinderPreview />} />}
            {process.env.NODE_ENV === 'development' && (
              <Route
                path='/home-flow-preview'
                element={<HomeCinematic variant='flow' loggedIn={!!user.loggedIn} completed={!!user.completed} />}
              />
            )}
            <Route path='/compare/:owner/:share' element={<Compare />} />
            <Route
              path='/'
              element={<HomeCinematic variant='cinematic' loggedIn={!!user.loggedIn} completed={!!user.completed} />}
            />
            <Route
              path='/about'
              element={
                <CinePage>
                  <About />
                </CinePage>
              }
            />
            <Route
              path='/faqs'
              element={
                <CinePage>
                  <FAQs />
                </CinePage>
              }
            />
            <Route path='/contact' element={<Contact />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/error' element={<ErrorPage />} />
            <Route path='/checkouterror' element={<CheckoutErrorPage />} />
            <Route path='*' element={<Navigate to='/error' replace />} />
          </Routes>
          </Suspense>
          </main>
          <Footer />
        </div>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
