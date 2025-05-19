import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { 
  Box, Typography, TextField, Button, Container, 
  List, ListItem, ListItemText, Divider, 
  CircularProgress, Chip, Alert, Avatar,
  Badge
} from '@mui/material';
import api from '../services/api';

function MessagesPage() {
  const { requestId } = useParams();
  const { user, logout  } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [requestDetails, setRequestDetails] = useState(null);
  const [isRequester, setIsRequester] = useState(false);

  useEffect(() => {
    let intervalId;
    
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${requestId}`);
        console.log('Received messages data:', data);
        setMessages(data.data.messages);
        setRequestDetails(data.data.request);
        setIsRequester(data.data.isRequester);
        
        if (!isRequester) {
          setTimeLeft(Math.floor(data.data.timeLeft / 1000)); // Convert to seconds
          
          // Update timer every second
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
  }, [requestId, isRequester]);

  const handleSendMessage = async () => {
    try {
      const endpoint = isRequester 
        ? '/messages' 
        : `/messages/${requestId}/respond`;
      
      await api.post(endpoint, {
        requestId: isRequester ? requestId : undefined,
        content: newMessage
      });
      
      // Refresh messages
      const { data } = await api.get(`/messages/${requestId}`);
      setMessages(data.data.messages);
      setNewMessage('');
      
      // Reset timer if responder
      if (!isRequester && data.data.timeLeft) {
        setTimeLeft(Math.floor(data.data.timeLeft / 1000));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          UniCommunication System
        </Typography>
        <IconButton 
          color="inherit" 
          onClick={() => logout()} 
          aria-label="logout"
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>

        {requestDetails && (
          <Typography variant="subtitle1" gutterBottom>
            {isRequester 
              ? `With: ${requestDetails.responder.name}` 
              : `From: ${requestDetails.requester.name}`}
          </Typography>
        )}

        {/* Timer and status display */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip 
            label={`Status: ${requestDetails?.status || 'unknown'}`} 
            color={requestDetails?.status === 'accepted' ? 'success' : 'default'}
          />
          
          {!isRequester && timeLeft > 0 && (
            <Chip 
              label={`Response time: ${Math.floor(timeLeft/60)}m ${timeLeft%60}s`}
              color="warning"
            />
          )}
          
          {!isRequester && timeLeft <= 0 && (
            <Chip 
              label="Response time expired"
              color="error"
            />
          )}
        </Box>
        
        <List sx={{ mb: 3, maxHeight: '60vh', overflow: 'auto' }}>
        {messages.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
            {isRequester ? 'Send your first message' : 'No messages received yet'}
            </Typography>
        ) : (
            messages.map((message) => (
            <Box key={message._id}>
                <ListItem alignItems="flex-start">
                <Box sx={{
                    display: 'flex',
                    flexDirection: message.sender._id === user._id ? 'row-reverse' : 'row',
                    width: '100%',
                    alignItems: 'flex-start'
                }}>
                    <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={message.sender.role === 'A' ? 'A' : 'B'}
                    >
                    <Avatar sx={{ 
                        bgcolor: message.sender.role === 'A' ? 'primary.main' : 'secondary.main',
                        mr: message.sender._id !== user._id ? 2 : 0,
                        ml: message.sender._id === user._id ? 2 : 0
                    }}>
                        {message.sender.name.charAt(0)}
                    </Avatar>
                    </Badge>
                    <Box sx={{
                    bgcolor: message.sender._id === user._id ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    maxWidth: '70%'
                    }}>
                    <Typography variant="subtitle2">
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
                <Divider />
            </Box>
            ))
        )}
        </List>
        
        {/* Message input */}
        {(isRequester || timeLeft > 0) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={
                isRequester ? 'Type your message...' : 'Type your response...'
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!isRequester && timeLeft <= 0}
              multiline
              rows={2}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || (!isRequester && timeLeft <= 0)}
              sx={{ height: '56px' }}
            >
              Send
            </Button>
          </Box>
        )}
      </Box>
    </Container>
    </>
  );
}

export default MessagesPage;