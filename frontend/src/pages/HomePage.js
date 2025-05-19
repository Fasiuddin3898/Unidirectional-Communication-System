// frontend/src/pages/HomePage.js
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Unidirectional Communication System
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Welcome to our platform
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" component={Link} to="/login">
            Login
          </Button>
          <Button variant="outlined" component={Link} to="/register">
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;