// src/pages/LoginPage.tsx  (albo src/components/LoginPage.tsx — tam gdzie masz plik)
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/turban2.png';

export type RegisterPageProps = {
  handleLogin: (
    username: string,
    password: string,
    register?: boolean,
  ) => Promise<void> | void;
};

export default function RegisterPage({ handleLogin }: RegisterPageProps) {
  const loginInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // zatrzymuje domyślne submitowanie formularza
    const username = loginInputRef.current?.value || '';
    const password = passwordInputRef.current?.value || '';

    await handleLogin(username, password, true);
    // jeśli rejestracja się udała, wracamy do login
    navigate('/');
  };

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
              <Typography variant="h5">Register</Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access MetaRem
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
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
            {/*//TODO: Ogarnąć kontrolę hasła*/}
            <TextField
              inputRef={passwordInputRef}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              autoComplete="current-password"
            />
            <TextField
              inputRef={passwordInputRef}
              label="Repeat password"
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
            ></Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={onLogin}
              >
                Register
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={() => navigate('/')}
              >
                Back to login
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
