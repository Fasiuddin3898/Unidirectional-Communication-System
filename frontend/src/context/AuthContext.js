import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current user state:', user);  // Debug user state
    console.log('Current token:', token);    // Debug token
    const loadUser = async () => {
      if (token) {
        try {
          console.log('Loading user with token:', token);  // Debug token loading
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Fetching user data...');  // Debug API call
          const { data } = await api.get('/users/me').catch(err => {
          console.error('API Error:', err.response); // More detailed error
          throw err;
        });
          console.log('User data received:', data);  // Debug API response
          const userData = data.data?.user || null;
          setUser(userData);
          console.log('User loaded:', userData);  // Debug user loading
        } catch (err) {
            console.error('Failed to load user:', err);
            console.error('Error details:', {
                status: err.response?.status,
                data: err.response?.data
            });
          logout();
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, [token]);

    const login = async (email, password) => {
    try {
        const { data } = await api.post('/login', { email, password });
        
        // Store token
        localStorage.setItem('token', data.token);
        setToken(data.token);
        
        // Normalize user data structure
        const normalizedUser = {
        _id: data.data.user.id,  // Map 'id' to '_id'
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role
        };
        
        setUser(normalizedUser);
        
        // Force state update before navigation
        await new Promise(resolve => setTimeout(resolve, 50));
        
        navigate('/dashboard', { replace: true });
        
    } catch (err) {
        console.error('Login error:', err);
        throw err;
    }
    };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post('/register', { name, email, password, role });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);