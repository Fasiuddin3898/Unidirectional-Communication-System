import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Container, CircularProgress, 
  Card, CardContent, Chip, Avatar, useTheme,
  List, ListItem, ListItemAvatar, ListItemText,
  Divider
} from '@mui/material';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../services/api';
import { motion } from 'framer-motion';

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

function RequestsPage() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/requests/my-requests');
        setRequests(data.data.requests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <Box sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CircularProgress size={80} sx={{ 
          color: theme.palette.primary.main,
          zIndex: 1 
        }} />
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
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
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

      <AppBar position="sticky" sx={{ 
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 700
          }}>
            My Requests
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={() => logout()} 
            aria-label="logout"
            sx={{
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.3s'
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 4,
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            mb: 4
          }}>
            <motion.div variants={fadeInUp}>
              <Typography variant="h3" component="h1" gutterBottom sx={{
                fontWeight: 700,
                color: theme.palette.primary.main
              }}>
                My Requests
              </Typography>
            </motion.div>

            {requests.length === 0 ? (
              <motion.div variants={fadeInUp}>
                <Typography variant="body1" sx={{ 
                  textAlign: 'center', 
                  my: 4,
                  color: theme.palette.text.secondary
                }}>
                  No requests found
                </Typography>
              </motion.div>
            ) : (
              <List sx={{ width: '100%' }}>
                {requests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    variants={fadeInUp}
                  >
                    <Card sx={{ 
                      mb: 2,
                      borderRadius: 3,
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}>
                      <Box sx={{ 
                        height: '8px',
                        background: request.status === 'accepted' ? 
                          `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)` :
                          request.status === 'rejected' ?
                          `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)` :
                          `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`
                      }} />
                      <CardContent>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: user.role === 'A' 
                                ? theme.palette.primary.main 
                                : theme.palette.secondary.main,
                              width: 56,
                              height: 56
                            }}>
                              {user.role === 'A' 
                                ? request.responder?.name?.charAt(0) 
                                : request.requester?.name?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {user.role === 'A' 
                                  ? `To: ${request.responder?.name}` 
                                  : `From: ${request.requester?.name}`}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <Chip 
                                    label={request.status.toUpperCase()} 
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '0.8rem',
                                      padding: '4px 8px',
                                      backgroundColor: request.status === 'accepted' ? 
                                        `${theme.palette.success.light}30` :
                                        request.status === 'rejected' ?
                                        `${theme.palette.error.light}30` :
                                        `${theme.palette.warning.light}30`,
                                      color: request.status === 'accepted' ? 
                                        theme.palette.success.main :
                                        request.status === 'rejected' ?
                                        theme.palette.error.main :
                                        theme.palette.warning.main
                                    }}
                                  />
                                  {request.expiresAt && (
                                    <Typography variant="caption" sx={{ ml: 2 }}>
                                      {new Date(request.expiresAt).toLocaleString()}
                                    </Typography>
                                  )}
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                      </CardContent>
                    </Card>
                    {index < requests.length - 1 && <Divider sx={{ my: 2 }} />}
                  </motion.div>
                ))}
              </List>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export default RequestsPage;