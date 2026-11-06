import React, {useState} from 'react';
import {Auth} from 'aws-amplify';
import {Link, useNavigate} from 'react-router-dom';
import {AuthLayout, Field, FormError, PasswordRules, authMessage} from '../design/AuthKit';

interface ForgotProps {
  onLogIn: () => void;
}

const Forgot: React.FC<ForgotProps> = (props: ForgotProps) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
    navigate(path, {replace: true});
  };

  const sendCode = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setError('');
    if (!email) return setError('Enter the email on your account.');
    setBusy(true);
    try {
      await Auth.forgotPassword(email);
      setCodeSent(true);
    } catch (err: unknown) {
      console.error(JSON.stringify(err));
      setError(authMessage((err as {code?: string}).code));
    }
    setBusy(false);
  };

  const reset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!code) return setError('Enter the code from your email.');
    if (!password) return setError('Choose a new password.');
    setBusy(true);
    try {
      const success = await Auth.forgotPasswordSubmit(email, code, password);
      if (success) {
        await Auth.signIn(email, password);
        props.onLogIn();
        handleNav('/');
      } else {
        setError('Your password wasn’t changed. Please try again.');
        setBusy(false);
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err));
      setError(authMessage((err as {code?: string}).code));
      setBusy(false);
    }
  };

  if (!codeSent) {
    return (
      <AuthLayout title='Reset your password' intro='We’ll email you a code so you can choose a new one.'>
        <form onSubmit={sendCode} noValidate className='pp-auth__fields'>
          <FormError message={error} />
          <Field id='forgot-email' label='Email' type='email' autoComplete='email' value={email} onChange={setEmail} />
          <button type='submit' className='pp-btn' disabled={busy}>
            {busy ? 'Sending…' : 'Email me a code'}
          </button>
        </form>
        <p className='pp-small pp-auth__alt'>
          Remembered it? <Link to='/login'>Log in</Link>.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title='Choose a new password' intro={<>We sent a code to <strong>{email}</strong>.</>}>
      <form onSubmit={reset} noValidate className='pp-auth__fields'>
        <FormError message={error} />
        <Field
          id='forgot-code'
          label='Code from the email'
          autoComplete='one-time-code'
          inputMode='numeric'
          value={code}
          onChange={setCode}
        />
        <PasswordRules />
        <Field
          id='forgot-new-password'
          label='New password'
          type='password'
          autoComplete='new-password'
          value={password}
          onChange={setPassword}
        />
        <button type='submit' className='pp-btn' disabled={busy}>
          {busy ? 'Saving…' : 'Save new password'}
        </button>
      </form>
      <p className='pp-small pp-auth__alt'>
        No email?{' '}
        <button type='button' className='pp-textlink' onClick={() => sendCode()} disabled={busy}>
          Send the code again
        </button>
      </p>
    </AuthLayout>
  );
};

export default Forgot;
