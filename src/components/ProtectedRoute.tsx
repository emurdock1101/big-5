import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import React from 'react';
import {UserContext} from '../App';
import Loading from './Loading';

interface ProtectedRouteProps {
  type: 'redirectIfLoggedIn' | 'redirectIfCompleted' | 'redirectIfUncompleted';
  component: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props: ProtectedRouteProps) => {
  const {user} = useContext(UserContext);

  if (user.loggedIn === undefined || user.completed === undefined) {
    return <Loading />;
  }

  if (props.type === 'redirectIfLoggedIn') {
    return user.loggedIn ? <Navigate to={'/'} replace /> : props.component;
  } else if (props.type === 'redirectIfCompleted') {
    return user.completed ? <Navigate to={'/'} replace /> : props.component;
  } else if (props.type === 'redirectIfUncompleted') {
    return !user.completed ? <Navigate to={'/'} replace /> : props.component;
  }

  return <Navigate to={'/'} replace />;
};

export default ProtectedRoute;
