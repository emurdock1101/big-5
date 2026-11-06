import React from 'react';
import Strip from './Strip';

/** Page shell for the account pages: heading on the left, the form in a sheet on the right. */
export const AuthLayout: React.FC<{title: string; intro?: React.ReactNode; children: React.ReactNode}> = ({
  title,
  intro,
  children,
}) => (
  <div className='pp'>
    <div className='pp-wrap pp-auth'>
      <div className='pp-auth__head'>
        <Strip />
        <h1 className='pp-display pp-h1'>{title}</h1>
        {intro && <div className='pp-lede pp-auth__intro'>{intro}</div>}
      </div>
      <div className='pp-auth__form pp-sheet'>{children}</div>
    </div>
  </div>
);

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

export const Field: React.FC<FieldProps> = ({id, label, type = 'text', autoComplete, value, onChange, hint, inputMode}) => (
  <div className='pp-field-row'>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      name={id}
      className='pp-input'
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-describedby={hint ? `${id}-hint` : undefined}
    />
    {hint && (
      <span id={`${id}-hint`} className='pp-small'>
        {hint}
      </span>
    )}
  </div>
);

export const FormError: React.FC<{message: string}> = ({message}) =>
  message ? (
    <p role='alert' className='pp-alert'>
      {message}
    </p>
  ) : null;

export const PasswordRules: React.FC = () => (
  <div className='pp-field-row'>
    <span className='pp-small' style={{fontWeight: 700}}>
      Your password needs at least:
    </span>
    <ul className='pp-checklist pp-small'>
      <li>8 characters</li>
      <li>1 lowercase and 1 uppercase letter</li>
      <li>1 number</li>
      <li>1 special character, such as ! or ?</li>
    </ul>
  </div>
);

/** Plain-language messages for the sign-in service's error codes. */
export function authMessage(code?: string): string {
  switch (code) {
    case 'UserNotFoundException':
      return 'We couldn’t find an account with that email. Check the spelling, or buy the test to create one.';
    case 'NotAuthorizedException':
      return 'That email and password don’t match. Try again, or reset your password.';
    case 'InvalidPasswordException':
      return 'That password doesn’t meet the rules below. Try one with upper and lowercase letters, a number and a special character.';
    case 'CodeMismatchException':
      return 'That code doesn’t match. Check the email we sent and try again.';
    case 'ExpiredCodeException':
      return 'That code has expired. Send yourself a new one.';
    case 'LimitExceededException':
    case 'TooManyRequestsException':
      return 'Too many attempts. Wait a few minutes, then try again.';
    case 'UserNotConfirmedException':
      return 'Your account isn’t confirmed yet. Check your email for the message we sent.';
    default:
      return 'Something went wrong on our side. Please try again in a moment.';
  }
}
