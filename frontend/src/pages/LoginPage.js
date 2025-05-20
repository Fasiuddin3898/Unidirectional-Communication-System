import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, TextField, Typography, Link, FormControl, InputLabel, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      const to = location.state?.from?.pathname || '/dashboard';
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden',
      py: 8
    }}>
      {/* Floating decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              background: `rgba(${theme.palette.primary.main}, 0.1)`,
              filter: 'blur(40px)'
            }}
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          />
        ))}
      </Box>

      <Container maxWidth="sm">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '8px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }
          }}>
            <motion.div variants={fadeInUp}>
              <Typography 
                component="h1" 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  textAlign: 'center',
                  color: theme.palette.primary.main
                }}
              >
                Welcome Back
              </Typography>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                  mb: 4
                }}
              >
                Sign in to your account
              </Typography>
            </motion.div>

            {error && (
              <motion.div variants={fadeInUp}>
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 2,
                    textAlign: 'center',
                    fontWeight: 500,
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    p: 1,
                    borderRadius: '4px'
                  }}
                >
                  {error}
                </Typography>
              </motion.div>
            )}

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ mt: 3 }}
            >
              <motion.div variants={fadeInUp}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Box sx={{ textAlign: 'right', mb: 2 }}>
                  <Link 
                    href="/forgot-password" 
                    variant="body2"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                  }}
                >
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export default LoginPage;