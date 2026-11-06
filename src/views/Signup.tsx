import React, {useState} from 'react';
import {Auth} from 'aws-amplify';
import {Link, useNavigate} from 'react-router-dom';
import {AuthLayout, Field, FormError, PasswordRules, authMessage} from '../design/AuthKit';

interface SignupProps {
  onLogIn: () => void;
}

/**
 * First login after purchase: sign in with the temporary password from the
 * account email, then set a permanent password.
 */
const Signup: React.FC<SignupProps> = (props: SignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  // The Cognito user returned by the first sign-in, needed to set the new password.
  const [user, setUser] = useState<unknown>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
    navigate(path, {replace: true});
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Enter the email you used to buy the test.');
    if (!password) return setError('Enter the temporary password from your email.');
    setBusy(true);
    try {
      const userCognito = await Auth.signIn(email, password);
      setUser(userCognito);
    } catch (err: unknown) {
      console.error(JSON.stringify(err));
      setError(authMessage((err as {code?: string}).code));
    }
    setBusy(false);
  };

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !newPasswordConfirm) return setError('Enter your new password twice.');
    if (newPassword !== newPasswordConfirm) return setError('The two passwords don’t match.');
    setBusy(true);
    try {
      await Auth.completeNewPassword(user, newPassword);
      props.onLogIn();
      handleNav('/test');
    } catch (err: unknown) {
      console.error(JSON.stringify(err));
      setError(authMessage((err as {code?: string}).code));
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <AuthLayout
        title='Welcome. Let’s set up your account.'
        intro='Thanks for buying the test. We’ve emailed you a temporary password. Use it here once, then choose your own.'>
        <form onSubmit={signUp} noValidate className='pp-auth__fields'>
          <p className='pp-auth__step'>Step 1 of 2</p>
          <FormError message={error} />
          <Field
            id='signup-email'
            label='Email you bought the test with'
            type='email'
            autoComplete='email'
            value={email}
            onChange={setEmail}
          />
          <Field
            id='signup-temp-password'
            label='Temporary password'
            type='password'
            autoComplete='current-password'
            value={password}
            onChange={setPassword}
            hint='It’s in the email from us. Check your spam folder if you don’t see it.'
          />
          <button type='submit' className='pp-btn' disabled={busy}>
            {busy ? 'Checking…' : 'Continue'}
          </button>
        </form>
        <p className='pp-small pp-auth__alt'>
          Already set your password? <Link to='/login'>Log in</Link>.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title='Choose your password' intro='This is the password you’ll use to come back to your results.'>
      <form onSubmit={register} noValidate className='pp-auth__fields'>
        <p className='pp-auth__step'>Step 2 of 2</p>
        <FormError message={error} />
        <PasswordRules />
        <Field
          id='signup-new-password'
          label='New password'
          type='password'
          autoComplete='new-password'
          value={newPassword}
          onChange={setNewPassword}
        />
        <Field
          id='signup-confirm-password'
          label='Type it again'
          type='password'
          autoComplete='new-password'
          value={newPasswordConfirm}
          onChange={setNewPasswordConfirm}
        />
        <button type='submit' className='pp-btn' disabled={busy}>
          {busy ? 'Saving…' : 'Save and start the test'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
