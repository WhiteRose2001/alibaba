// src/pages/LoginPage.tsx  (albo src/components/LoginPage.tsx — tam gdzie masz plik)
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/turban2.png';
import { Snackbar } from '@mui/material';

export type LoginPageProps = {
  handleLogin: (username: string, password: string) => Promise<void> | void;
  isLoggedIn: boolean;
  loginStatus: string | null;
  // <-- dodane pole, opcjonalne
  onContinueAsGuest?: () => void;
};

export default function LoginPage({
  handleLogin,
  isLoggedIn,
  loginStatus,
  onContinueAsGuest,
}: LoginPageProps) {
  const loginInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // zatrzymuje domyślne submitowanie formularza
    const username = loginInputRef.current?.value || '';
    const password = passwordInputRef.current?.value || '';
    await handleLogin(username, password);
  };

  const continueToDashboard = () => {
    // jeśli przekazano callback onContinueAsGuest - wywołaj go
    if (onContinueAsGuest) {
      onContinueAsGuest();
    }
    // zawsze nawiguj do /
    navigate('/');
  };

  //TODO: Ogarnąć komunikaty - powtarzają się bez sensu
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    setSnackbarOpen(true);
  }, [loginStatus]);

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card
        sx={{ width: { xs: '100%', sm: 480 }, borderRadius: 2, boxShadow: 6 }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar src={logo} sx={{ width: 44, height: 44 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box>
              <Typography variant="h5">Welcome</Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access MetaRem
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {!isLoggedIn ? (
            <Box component="form" onSubmit={onLogin} noValidate>
              <TextField
                inputRef={loginInputRef}
                label="Email or username"
                type="text"
                fullWidth
                margin="normal"
                required
                autoComplete="username"
              />

              <TextField
                inputRef={passwordInputRef}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                required
                autoComplete="current-password"
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 1,
                }}
              >
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => alert('Forgot password not implemented')}
                >
                  Forgot password?
                </Link>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  onClick={onLogin}
                >
                  Login
                </Button>

                {/* Continue as guest */}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={continueToDashboard}
                >
                  {/* Continue to dashboard */}
                  Continue to dashboard
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Don't have an account?{' '}
                <Link component="button" onClick={() => navigate('/register')}>
                  Register
                </Link>
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6" gutterBottom>
                You are logged in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click below to logout (this calls your `handleLogin('', '')`).
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      {loginStatus && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={loginStatus}
        />
      )}
    </Box>
  );
}
