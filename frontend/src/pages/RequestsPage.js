// frontend/src/pages/RequestsPage.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Container } from '@mui/material';
import api from '../services/api';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function RequestsPage() {
  const { user,logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return <div>Loading...</div>;
  }

  return (
    <>
    <AppBar position="static">
    <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        My Requests
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Requests
        </Typography>
        {requests.length === 0 ? (
          <Typography>No requests found</Typography>
        ) : (
          <ul>
            {requests.map(request => (
              <li key={request._id}>
                {user.role === 'A' ? 
                  `To: ${request.responder.name}` : 
                  `From: ${request.requester.name}`} - Status: {request.status}
              </li>
            ))}
          </ul>
        )}
      </Box>
    </Container>
    </>
  );
}

export default RequestsPage;