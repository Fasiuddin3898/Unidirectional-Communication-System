import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Button, Container, Grid, 
  Card, CardContent, CircularProgress, Chip,
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [messageContent, setMessageContent] = useState('');

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
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.name}
        </Typography>
        <Typography variant="h6" gutterBottom>
          You are a {user.role === 'A' ? 'Requester (Type A)' : 'Responder (Type B)'}
        </Typography>
        
        {user.role === 'A' && (
          <Button 
            variant="contained" 
            onClick={handleCreateRequests}
            sx={{ mb: 3 }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Requests to All Responders'}
          </Button>
        )}
        
        <Grid container spacing={3}>
          {requests.map((request) => (
            <Grid item xs={12} sm={6} key={request._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {user.role === 'A' ? 
                      `To: ${request.responder?.name}` : 
                      `From: ${request.requester?.name}`}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <Chip 
                      label={request.status} 
                      color={
                        request.status === 'accepted' ? 'success' : 
                        request.status === 'rejected' ? 'error' : 'warning'
                      } 
                    />
                    {request.expiresAt && (
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {new Date(request.expiresAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  {request.status === 'accepted' && (
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenMessageDialog(request._id)}
                      sx={{ mt: 2 }}
                    >
                      {user.role === 'A' ? 'Send Message' : 'Respond'}
                    </Button>
                  )}

                  {user.role === 'B' && request.status === 'pending' && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAcceptRequest(request._id)}
                        sx={{ mr: 2 }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Message Dialog */}
        <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
          <DialogTitle>
            {user.role === 'A' ? 'Send Message' : 'Respond to Request'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={user.role === 'A' ? 'Your message' : 'Your response'}
              fullWidth
              multiline
              rows={4}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!messageContent.trim()}
              variant="contained"
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default DashboardPage;