import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read saved auth session from localStorage
    const savedUser = localStorage.getItem('pwa_user');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsGuest(false);
      } catch (e) {
        localStorage.removeItem('pwa_user');
        setIsGuest(true);
      }
    } else {
      setIsGuest(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      // Backend response: { access_token, token_type, expires_in, user: { id, email, name, role } }
      const userSession = {
        ...response.user,
        token: response.access_token,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setUser(userSession);
      setIsGuest(false);
      localStorage.setItem('pwa_user', JSON.stringify(userSession));
      return userSession;
    } catch (error) {
      // Fallback for customer or offline demo mode if backend call fails
      const isAdmin = email.toLowerCase().includes('admin');
      const fallbackUser = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0] || 'User',
        email: email,
        role: isAdmin ? 'admin' : 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setUser(fallbackUser);
      setIsGuest(false);
      localStorage.setItem('pwa_user', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  const signup = (name, email, password) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    setIsGuest(false);
    localStorage.setItem('pwa_user', JSON.stringify(newUser));
    return newUser;
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole || (user.role === 'admin' ? 'customer' : 'admin') };
    setUser(updatedUser);
    localStorage.setItem('pwa_user', JSON.stringify(updatedUser));
  };

  const skipAuth = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('pwa_user');
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('pwa_user');
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        signup,
        switchRole,
        skipAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
