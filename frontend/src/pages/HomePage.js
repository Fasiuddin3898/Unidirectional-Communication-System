import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/communication-hero.png'; // Add your image

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

function HomePage() {
  const theme = useTheme();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Optional particle background */}
      {/* <ParticlesBackground /> */}
      
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 6,
          py: 8
        }}>
          {/* Left side - Text content */}
          <Box sx={{ flex: 1, zIndex: 1 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  Unidirectional{' '}
                  <Box 
                    component="span" 
                    sx={{ 
                      color: theme.palette.secondary.main,
                      textDecoration: 'underline',
                      textDecorationThickness: '3px',
                      textUnderlineOffset: '8px'
                    }}
                  >
                    Communication
                  </Box>{' '}
                  System
                </Typography>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 4,
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  Streamline your communication workflow with our secure platform
                </Typography>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                sx={{ display: 'flex', gap: 3, mt: 4 }}
              >
                <Button
                  variant="contained"
                  component={Link}
                  to="/login"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/register"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                      transform: 'translateY(-2px)',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Register Here
                </Button>
              </motion.div>
            </motion.div>
          </Box>

          {/* Right side - Image */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            zIndex: 1
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Box
                component="img"
                src={heroImage}
                alt="Communication illustration"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  transform: 'perspective(1000px) rotateY(-10deg)',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)'
                  }
                }}
              />
            </motion.div>
          </Box>
        </Box>

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
      </Container>
    </Box>
  );
}

export default HomePage;