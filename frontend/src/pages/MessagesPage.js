import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, TextField, Button, Container, 
  List, ListItem, Divider, CircularProgress, Chip, 
  Avatar, Badge, useTheme, useMediaQuery
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
      staggerChildren: 0.1
    }
  }
};

const messageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

function MessagesPage() {
  const { requestId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [requestDetails, setRequestDetails] = useState(null);
  const [isRequester, setIsRequester] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    let intervalId;
    
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${requestId}`);
        setMessages(data.data.messages);
        setRequestDetails(data.data.request);
        setIsRequester(data.data.isRequester);
        
        if (!data.data.isRequester) {
          setTimeLeft(Math.floor(data.data.timeLeft / 1000));
          
          intervalId = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 0) {
                clearInterval(intervalId);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.response?.data?.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [requestId]);

  const handleSendMessage = async () => {
    try {
      const endpoint = isRequester 
        ? '/messages' 
        : `/messages/${requestId}/respond`;
      
      await api.post(endpoint, {
        requestId: isRequester ? requestId : undefined,
        content: newMessage
      });
      
      const { data } = await api.get(`/messages/${requestId}`);
      setMessages(data.data.messages);
      setNewMessage('');
      
      if (!isRequester && data.data.timeLeft) {
        setTimeLeft(Math.floor(data.data.timeLeft / 1000));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

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

  if (error) {
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
        <Container maxWidth="sm" sx={{ zIndex: 1 }}>
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 4,
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="h5" color="error" gutterBottom>
              Error
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
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
              Back to Dashboard
            </Button>
          </Box>
        </Container>
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
            Messages
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

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
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
              <Button 
                onClick={() => navigate('/dashboard')} 
                sx={{ 
                  mb: 3,
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.3s'
                  }
                }}
              >
                ← Back to Dashboard
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2
              }}>
                Conversation
              </Typography>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {isRequester 
                  ? `With: ${requestDetails?.responder?.name}` 
                  : `From: ${requestDetails?.requester?.name}`}
              </Typography>
            </motion.div>

            {/* Timer and status display */}
            <motion.div variants={fadeInUp}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Status: ${requestDetails?.status?.toUpperCase() || 'UNKNOWN'}`} 
                  sx={{
                    fontWeight: 700,
                    backgroundColor: requestDetails?.status === 'accepted' 
                      ? `${theme.palette.success.light}30`
                      : `${theme.palette.warning.light}30`,
                    color: requestDetails?.status === 'accepted' 
                      ? theme.palette.success.main
                      : theme.palette.warning.main
                  }}
                />
                
                {!isRequester && timeLeft > 0 && (
                  <Chip 
                    label={`Time left: ${Math.floor(timeLeft/60)}m ${timeLeft%60}s`}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: `${theme.palette.warning.light}30`,
                      color: theme.palette.warning.main
                    }}
                  />
                )}
                
                {!isRequester && timeLeft <= 0 && (
                  <Chip 
                    label="Response time expired"
                    sx={{
                      fontWeight: 700,
                      backgroundColor: `${theme.palette.error.light}30`,
                      color: theme.palette.error.main
                    }}
                  />
                )}
              </Box>
            </motion.div>
          </Box>

          {/* Messages list */}
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 4,
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            mb: 4,
            maxHeight: '60vh',
            overflow: 'auto'
          }}>
            {messages.length === 0 ? (
              <motion.div variants={fadeInUp}>
                <Typography variant="body1" sx={{ 
                  textAlign: 'center', 
                  my: 4,
                  color: theme.palette.text.secondary
                }}>
                  {isRequester ? 'Send your first message' : 'No messages received yet'}
                </Typography>
              </motion.div>
            ) : (
              <List>
                {messages.map((message, index) => (
                  <motion.div
                    key={message._id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <Box sx={{ mb: 2 }}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: message.sender._id === user._id ? 'row-reverse' : 'row',
                          width: '100%',
                          alignItems: 'flex-start',
                          gap: 2
                        }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box sx={{ 
                                bgcolor: message.sender.role === 'A' 
                                  ? theme.palette.primary.main 
                                  : theme.palette.secondary.main,
                                color: 'white',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}>
                                {message.sender.role}
                              </Box>
                            }
                          >
                            <Avatar sx={{ 
                              bgcolor: message.sender.role === 'A' 
                                ? theme.palette.primary.main 
                                : theme.palette.secondary.main,
                              width: 48,
                              height: 48
                            }}>
                              {message.sender.name.charAt(0)}
                            </Avatar>
                          </Badge>
                          
                          <Box sx={{
                            bgcolor: message.sender._id === user._id 
                              ? `${theme.palette.primary.light}20` 
                              : `${theme.palette.grey[300]}30`,
                            borderRadius: 3,
                            px: 3,
                            py: 2,
                            maxWidth: isMobile ? '70%' : '60%',
                            border: `1px solid ${message.sender._id === user._id 
                              ? theme.palette.primary.light 
                              : theme.palette.grey[300]}`,
                            position: 'relative',
                            '&:after': {
                              content: '""',
                              position: 'absolute',
                              top: 20,
                              [message.sender._id === user._id ? 'right' : 'left']: -10,
                              width: 0,
                              height: 0,
                              border: '10px solid transparent',
                              borderRight: message.sender._id === user._id 
                                ? 'none' 
                                : `10px solid ${theme.palette.grey[300]}`,
                              borderLeft: message.sender._id === user._id 
                                ? `10px solid ${theme.palette.primary.light}` 
                                : 'none'
                            }
                          }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {message.sender.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(message.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {message.content}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < messages.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  </motion.div>
                ))}
              </List>
            )}
          </Box>

          {/* Message input */}
          {(isRequester || timeLeft > 0) && (
            <motion.div variants={fadeInUp}>
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 3,
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                display: 'flex', 
                gap: 2,
                alignItems: 'flex-end'
              }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={
                    isRequester ? 'Type your message...' : 'Type your response...'
                  }
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  multiline
                  rows={2}
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
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || (!isRequester && timeLeft <= 0)}
                  sx={{ 
                    height: '56px',
                    borderRadius: '12px',
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:disabled': {
                      background: theme.palette.grey[300],
                      color: theme.palette.grey[500]
                    }
                  }}
                >
                  Send
                </Button>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}

export default MessagesPage;