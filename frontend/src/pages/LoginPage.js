import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, TextField, Typography, Link } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         console.log('Attempting login...'); // Debug
//         await login(email, password);
//         console.log('Login successful, should redirect'); // Debug
//     } catch (err) {
//         console.error('Login failed:', err); // Detailed error log
//         setError('Invalid email or password');
//     }
//    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login with:', email, password); // Debug
            await login(email, password);
            console.log('Login completed, redirect should happen'); // Debug
            const to = location.state?.from?.pathname || '/dashboard';
            navigate(to, { replace: true });
            console.log('Login completed, redirect should happen 2'); // Debug
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography>
            Don't have an account?{' '}
            <Link href="/register" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;