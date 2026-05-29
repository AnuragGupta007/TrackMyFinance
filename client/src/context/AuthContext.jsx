import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api/auth.api';
import { DEMO_USER } from '../utils/demoData';

const AuthContext = createContext(null);

const DEMO_TOKEN = 'demo_mode_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tmf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('tmf_token'));
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem('tmf_token') === DEMO_TOKEN);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      // Skip API verification in demo mode
      if (token === DEMO_TOKEN) {
        setIsDemo(true);
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        setUser(res.data);
        localStorage.setItem('tmf_user', JSON.stringify(res.data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    const { user: userData, token: authToken } = res.data;
    setUser(userData);
    setToken(authToken);
    setIsDemo(false);
    localStorage.setItem('tmf_token', authToken);
    localStorage.setItem('tmf_user', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authApi.register(userData);
    const { user: newUser, token: authToken } = res.data;
    setUser(newUser);
    setToken(authToken);
    setIsDemo(false);
    localStorage.setItem('tmf_token', authToken);
    localStorage.setItem('tmf_user', JSON.stringify(newUser));
    return newUser;
  }, []);

  const loginAsDemo = useCallback(() => {
    setUser(DEMO_USER);
    setToken(DEMO_TOKEN);
    setIsDemo(true);
    localStorage.setItem('tmf_token', DEMO_TOKEN);
    localStorage.setItem('tmf_user', JSON.stringify(DEMO_USER));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsDemo(false);
    localStorage.removeItem('tmf_token');
    localStorage.removeItem('tmf_user');
  }, []);

  const updateUser = useCallback(async (updates) => {
    if (isDemo) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('tmf_user', JSON.stringify(updated));
      return updated;
    }
    const res = await authApi.updateProfile(updates);
    setUser(res.data);
    localStorage.setItem('tmf_user', JSON.stringify(res.data));
    return res.data;
  }, [isDemo, user]);

  const value = {
    user,
    token,
    loading,
    isDemo,
    isAuthenticated: !!user && !!token,
    login,
    register,
    loginAsDemo,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
