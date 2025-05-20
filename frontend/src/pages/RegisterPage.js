import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, TextField, Typography, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('A');
  const [error, setError] = useState('');
  const { register, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
                Create Your Account
              </Typography>
            </motion.div>

            {error && (
              <motion.div variants={fadeInUp}>
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 2,
                    textAlign: 'center',
                    fontWeight: 500
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
                  label="Name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  label="Email Address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <FormControl fullWidth margin="normal" sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="A">Requester (Type A)</MenuItem>
                    <MenuItem value="B">Responder (Type B)</MenuItem>
                  </Select>
                </FormControl>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
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
                  Sign Up
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
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign in
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

export default RegisterPage;