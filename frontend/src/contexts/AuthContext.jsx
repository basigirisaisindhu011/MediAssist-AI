import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token expiry helper
  const isTokenExpired = (jwtToken) => {
    if (!jwtToken) return true;
    try {
      const payloadBase64 = jwtToken.split('.')[1];
      if (!payloadBase64) return true;
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      if (!decoded.exp) return false;
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUser(storedUser);

        // Optionally fetch fresh user info from server
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Could not refresh user session:', err);
        }
      } else {
        authService.logout();
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setToken(data.token);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });
    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !isTokenExpired(token),
    loading,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
