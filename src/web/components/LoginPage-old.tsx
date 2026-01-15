import { useRef } from 'react';

export type UploaderProps = {
  handleLogin: (username: string, password: string) => void;
  isLoggedIn: boolean;
};

export const LoginPage = ({ handleLogin, isLoggedIn }: UploaderProps) => {
  const loginInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const onLogin = () => {
    const username = loginInputRef.current?.value || '';
    const password = passwordInputRef.current?.value || '';
    handleLogin(username, password);
  };

  return (
    <div>
      {!isLoggedIn && <><input ref={loginInputRef} type="input" name="login_input"/>
        <input ref={passwordInputRef} type='password' name='password_input'/></>}
      <button onClick={onLogin}>{isLoggedIn ? 'Logout' : 'Login'}</button>
    </div>
  );};