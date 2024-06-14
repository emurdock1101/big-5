import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import React from 'react';
import {UserContext} from '../App';
import Loading from './Loading';

interface ProtectedRouteProps {
  type: 'loggedOut' | 'loggedInAndCompleted' | 'loggedInAndUncompleted';
  component: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props: ProtectedRouteProps) => {
  const {user} = useContext(UserContext);

  if (user.loggedIn === undefined || user.completed === undefined) {
    return <Loading />;
  } else if (props.type === 'loggedOut' && !user.loggedIn) {
    return props.component;
  } else if (props.type === 'loggedInAndCompleted' && user.loggedIn && user.completed) {
    return props.component;
  } else if (props.type === 'loggedInAndUncompleted' && user.loggedIn && !user.completed) {
    return props.component;
  }

  return <Navigate to={'/'} replace />;
};

export default ProtectedRoute;
