import React, {useState} from 'react';
import {Auth} from 'aws-amplify';
import {Link, useNavigate} from 'react-router-dom';
import {AuthLayout, Field, FormError, authMessage} from '../design/AuthKit';
import {PRICE} from '../design/traits';

interface LoginProps {
  onLogIn: () => void;
}

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
    navigate(path);
  };

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!username) return setError('Enter your email.');
    if (!password) return setError('Enter your password.');
    setBusy(true);
    try {
      await Auth.signIn(username, password);
      props.onLogIn();
      handleNav('/results');
    } catch (err: unknown) {
      console.error(JSON.stringify(err));
      setError(authMessage((err as {code?: string}).code));
      setBusy(false);
    }
  };

  return (
    <AuthLayout title='Log in' intro='Your results are saved to your account. Log in to see them anytime.'>
      <form onSubmit={logIn} noValidate className='pp-auth__fields'>
        <FormError message={error} />
        <Field id='login-email' label='Email' type='email' autoComplete='email' value={username} onChange={setUsername} />
        <Field
          id='login-password'
          label='Password'
          type='password'
          autoComplete='current-password'
          value={password}
          onChange={setPassword}
        />
        <Link to='/reset' className='pp-textlink' style={{justifySelf: 'start'}}>
          Forgot your password?
        </Link>
        <button type='submit' className='pp-btn' disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className='pp-small pp-auth__alt'>
        Just bought the test? <Link to='/signup'>Use the temporary login we emailed you</Link>.
        <br />
        No account yet? <Link to='/buy'>Take the test for {PRICE}</Link>.
      </p>
    </AuthLayout>
  );
};

export default Login;
