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
import backgroundImage from '../assets/background.jpg'; // Add your own image
import requesterIcon from '../assets/requester.png'; // Add icons
import responderIcon from '../assets/responder.png';

// Animation variants added
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

//   if (!user || loading) {
//     return (
//       <Container maxWidth="lg">
//         <Box display="flex" justifyContent="center" mt={10}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     );
//   }

//   return (
//     <>
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Dashboard
//         </Typography>
//         <IconButton 
//           color="inherit" 
//           onClick={() => logout()} 
//           aria-label="logout"
//         >
//           <LogoutIcon />
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//     <Container maxWidth="lg">
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Welcome, {user.name}
//         </Typography>
//         <Typography variant="h6" gutterBottom>
//           You are a {user.role === 'A' ? 'Requester (Type A)' : 'Responder (Type B)'}
//         </Typography>
        
//         {user.role === 'A' && (
//           <Button 
//             variant="contained" 
//             onClick={handleCreateRequests}
//             sx={{ mb: 3 }}
//             disabled={loading}
//           >
//             {loading ? 'Sending...' : 'Send Requests to All Responders'}
//           </Button>
//         )}
        
//         <Grid container spacing={3}>
//           {requests.map((request) => (
//             <Grid item xs={12} sm={6} key={request._id}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">
//                     {user.role === 'A' ? 
//                       `To: ${request.responder?.name}` : 
//                       `From: ${request.requester?.name}`}
//                   </Typography>
                  
//                   <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
//                     <Chip 
//                       label={request.status} 
//                       color={
//                         request.status === 'accepted' ? 'success' : 
//                         request.status === 'rejected' ? 'error' : 'warning'
//                       } 
//                     />
//                     {request.expiresAt && (
//                       <Typography variant="caption" sx={{ ml: 1 }}>
//                         {new Date(request.expiresAt).toLocaleString()}
//                       </Typography>
//                     )}
//                   </Box>

//                   {request.status === 'accepted' && (
//                     <Button
//                       variant="outlined"
//                       component={Link} 
//                       to={`/messages/${request._id}`}  // This will navigate to MessagesPage
//                       sx={{ mt: 2 }}
//                     >
//                       {user.role === 'A' ? 'Send Message' : 'Respond'}
//                     </Button>
//                   )}

//                   {user.role === 'B' && request.status === 'pending' && (
//                     <Box sx={{ mt: 2 }}>
//                       <Button
//                         variant="contained"
//                         color="success"
//                         onClick={() => handleAcceptRequest(request._id)}
//                         sx={{ mr: 2 }}
//                       >
//                         Accept
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         onClick={() => handleRejectRequest(request._id)}
//                       >
//                         Reject
//                       </Button>
//                     </Box>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Message Dialog */}
//         <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
//           <DialogTitle>
//             {user.role === 'A' ? 'Send Message' : 'Respond to Request'}
//           </DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label={user.role === 'A' ? 'Your message' : 'Your response'}
//               fullWidth
//               multiline
//               rows={4}
//               value={messageContent}
//               onChange={(e) => setMessageContent(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
//             <Button 
//               onClick={handleSendMessage}
//               disabled={!messageContent.trim()}
//               variant="contained"
//             >
//               Send
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Container>
//     </>  );
// }

// export default DashboardPage;

if (!user || loading) {
    return (
      <Box sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress size={80} thickness={4} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgroundImage})`,
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <AppBar position="sticky" sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1,
            fontFamily: 'Montserrat',
            fontWeight: 700,
            letterSpacing: '0.1rem'
          }}>
            UniComm Dashboard
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
            <LogoutIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: 4,
          p: 3,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <Avatar 
            src={user.role === 'A' ? requesterIcon : responderIcon}
            sx={{ 
              width: 100, 
              height: 100,
              margin: '0 auto',
              border: '4px solid #2196F3'
            }}
          />
          <Typography variant="h3" component="h1" gutterBottom sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontFamily: 'Montserrat'
          }}>
            Welcome, {user.name}
          </Typography>
          <Chip 
            label={`You are a ${user.role === 'A' ? 'Requester (Type A)' : 'Responder (Type B)'}`}
            color={user.role === 'A' ? 'primary' : 'secondary'}
            sx={{
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '50px'
            }}
          />
        </Box>
        
        {user.role === 'A' && (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleCreateRequests}
              sx={{ 
                mb: 3,
                fontSize: '1.1rem',
                padding: '12px 24px',
                borderRadius: '50px',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s'
                }
              }}
              disabled={loading}
            >
              {loading ? 'Sending...' : '📨 Send Requests to All Responders'}
            </Button>
          </Box>
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
                <Paper elevation={4} sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <Box sx={{ 
                    height: '8px',
                    background: request.status === 'accepted' ? 
                      'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)' :
                      request.status === 'rejected' ?
                      'linear-gradient(90deg, #F44336 0%, #FF9800 100%)' :
                      'linear-gradient(90deg, #FFC107 0%, #FF9800 100%)'
                  }} />
                  <CardContent sx={{ position: 'relative' }}>
                    <Box sx={{ 
                      position: 'absolute',
                      top: -30,
                      right: 20,
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
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
                          letterSpacing: '0.5px',
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          background: request.status === 'accepted' ? 
                            'rgba(76, 175, 80, 0.2)' :
                            request.status === 'rejected' ?
                            'rgba(244, 67, 54, 0.2)' :
                            'rgba(255, 193, 7, 0.2)',
                          color: request.status === 'accepted' ? 
                            '#4CAF50' :
                            request.status === 'rejected' ?
                            '#F44336' :
                            '#FFC107'
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
                          borderRadius: '50px',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.3s'
                          }
                        }}
                      >
                        {user.role === 'A' ? '💬 Send Message' : '✍️ Respond'}
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
                            borderRadius: '50px',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              transition: 'transform 0.3s'
                            }
                          }}
                        >
                          👍 Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRejectRequest(request._id)}
                          sx={{ 
                            flex: 1,
                            borderRadius: '50px',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              transition: 'transform 0.3s'
                            }
                          }}
                        >
                          👎 Reject
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Paper>
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
              padding: 2,
              minWidth: isMobile ? '90%' : '500px'
            }
          }}
        >
          <DialogTitle sx={{ 
            fontSize: '1.5rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            borderRadius: '12px 12px 0 0',
            margin: -2,
            marginBottom: 2,
            padding: 3
          }}>
            {user.role === 'A' ? '✉️ Send Message' : '✍️ Respond to Request'}
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
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
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#2196F3'
                  },
                  '&:hover fieldset': {
                    borderColor: '#21CBF3'
                  }
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setMessageDialogOpen(false)}
              sx={{
                borderRadius: '50px',
                padding: '8px 20px',
                border: '1px solid #2196F3',
                color: '#2196F3',
                '&:hover': {
                  background: 'rgba(33, 150, 243, 0.1)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!messageContent.trim()}
              sx={{
                borderRadius: '50px',
                padding: '8px 20px',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s'
                },
                '&:disabled': {
                  background: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default DashboardPage;