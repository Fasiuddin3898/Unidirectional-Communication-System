import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Button, Container, Grid, 
  Card, CardContent, CircularProgress, Chip,
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, useTheme, useMediaQuery, Paper, Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/background.jpg';
import requesterIcon from '../assets/requester.png';
import responderIcon from '../assets/responder.png';

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

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

function DashboardPage() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/requests/my-requests');
        setRequests(data.data.requests);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const handleCreateRequests = async () => {
    try {
      setLoading(true);
      await api.post('/requests');
      const { data } = await api.get('/requests/my-requests');
      setRequests(data.data.requests);
    } catch (err) {
      console.error('Failed to create requests:', err);
      alert(err.response?.data?.message || 'Failed to send requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const { data } = await api.patch(`/requests/${requestId}/accept`);
      setRequests(requests.map(req => 
        req._id === requestId ? data.data.request : req
      ));
    } catch (err) {
      console.error('Failed to accept request:', err);
      alert(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const { data } = await api.patch(`/requests/${requestId}/reject`);
      setRequests(requests.map(req => 
        req._id === requestId ? data.data.request : req
      ));
    } catch (err) {
      console.error('Failed to reject request:', err);
      alert(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleOpenMessageDialog = (requestId) => {
    setCurrentRequestId(requestId);
    setMessageDialogOpen(true);
  };

  const handleSendMessage = async () => {
    try {
      await api.post('/messages', {
        requestId: currentRequestId,
        content: messageContent
      });
      setMessageDialogOpen(false);
      setMessageContent('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (!user || loading) {
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
            UniCommunication Dashboard
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
            textAlign: 'center',
            mb: 4,
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)'
          }}>
            <motion.div variants={fadeInUp}>
              <Avatar 
                src={user.role === 'A' ? requesterIcon : responderIcon}
                sx={{ 
                  width: 120, 
                  height: 120,
                  margin: '0 auto',
                  border: `4px solid ${theme.palette.primary.main}`
                }}
              />
              <Typography variant="h3" component="h1" gutterBottom sx={{
                mt: 3,
                fontWeight: 700,
                color: theme.palette.primary.main
              }}>
                Welcome, {user.name}
              </Typography>
              <Chip 
                label={`You are a ${user.role === 'A' ? 'Requester (Type A)' : 'Responder (Type B)'}`}
                color={user.role === 'A' ? 'primary' : 'secondary'}
                sx={{
                  fontSize: '1rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '50px',
                  fontWeight: 600
                }}
              />
            </motion.div>
          </Box>
          
          {user.role === 'A' && (
            <motion.div variants={fadeInUp}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Button 
                  variant="contained" 
                  onClick={handleCreateRequests}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    borderRadius: '50px',
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
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send Requests to All Responders'
                  )}
                </Button>
              </Box>
            </motion.div>
          )}
          
          <Grid container spacing={3}>
            {requests.map((request, index) => (
              <Grid item xs={12} sm={6} md={4} key={request._id}>
                <motion.div
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  custom={index}
                >
                  <Card sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                    <CardContent sx={{ position: 'relative' }}>
                      <Box sx={{ 
                        position: 'absolute',
                        top: -30,
                        right: 20,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                      }}>
                        {index + 1}
                      </Box>
                      
                      <Typography variant="h6" sx={{ 
                        mt: 2,
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      }}>
                        {user.role === 'A' ? 
                          `To: ${request.responder?.name}` : 
                          `From: ${request.requester?.name}`}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        mb: 2
                      }}>
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
                          <Typography variant="caption" sx={{ 
                            ml: 1,
                            color: theme.palette.text.secondary
                          }}>
                            {new Date(request.expiresAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      {request.status === 'accepted' && (
                        <Button
                          variant="contained"
                          component={Link} 
                          to={`/messages/${request._id}`}
                          sx={{ 
                            mt: 2,
                            width: '100%',
                            borderRadius: '12px',
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                            },
                            transition: 'all 0.3s ease',
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                          }}
                        >
                          {user.role === 'A' ? 'Send Message' : 'Respond'}
                        </Button>
                      )}

                      {user.role === 'B' && request.status === 'pending' && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleAcceptRequest(request._id)}
                            sx={{ 
                              flex: 1,
                              borderRadius: '12px',
                              py: 1.5,
                              fontWeight: 600,
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRejectRequest(request._id)}
                            sx={{ 
                              flex: 1,
                              borderRadius: '12px',
                              py: 1.5,
                              fontWeight: 600,
                              borderWidth: '2px',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                borderWidth: '2px',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Message Dialog */}
          <Dialog 
            open={messageDialogOpen} 
            onClose={() => setMessageDialogOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                overflow: 'hidden',
                width: isMobile ? '90%' : '500px',
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)'
              }
            }}
          >
            <Box sx={{ 
              height: '8px',
              width: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }} />
            <DialogTitle sx={{ 
              fontSize: '1.25rem',
              fontWeight: 700,
              color: theme.palette.primary.main,
              py: 3
            }}>
              {user.role === 'A' ? 'Send Message' : 'Respond to Request'}
            </DialogTitle>
            <DialogContent sx={{ py: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label={user.role === 'A' ? 'Your message' : 'Your response'}
                fullWidth
                multiline
                rows={6}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: theme.palette.primary.light
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={() => setMessageDialogOpen(false)}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  border: `2px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.light}20`,
                    border: `2px solid ${theme.palette.primary.main}`
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                  },
                  transition: 'all 0.3s ease',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  '&:disabled': {
                    background: theme.palette.grey[300],
                    color: theme.palette.grey[500]
                  }
                }}
              >
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
}

export default DashboardPage;