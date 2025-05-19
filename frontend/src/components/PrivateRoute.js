import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { user, isLoading, token } = useAuth();
  const location = useLocation();

  // Show loading only if we have a token but user isn't loaded yet
  if (token && !user && isLoading) {
    return <CircularProgress />;
  }

  // Redirect only if we're certain user isn't authenticated
  if (!token && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
