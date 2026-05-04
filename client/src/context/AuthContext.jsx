import { createContext, useContext, useState, useEffect } from 'react';
import { login, signup, logout, guestLogin, getMe } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — check if we already have a token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const handleSignup = async (name, email, password) => {
    const data = await signup(name, email, password);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const handleGuest = async () => {
    const data = await guestLogin();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const handleLogout = async () => {
    try { await logout(); } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isGuest = user?.role === 'guest';
  const isUser  = user?.role === 'user';

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAdmin, isGuest, isUser,
      login:  handleLogin,
      signup: handleSignup,
      guest:  handleGuest,
      logout: handleLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — call useAuth() in any component
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};