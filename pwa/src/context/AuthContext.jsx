import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read saved auth session from localStorage
    const savedUser = localStorage.getItem('pwa_user');
    const savedGuest = localStorage.getItem('pwa_guest');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('pwa_user');
      }
    } else if (savedGuest === 'true') {
      setIsGuest(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock successful authentication
    const mockUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0] || 'User',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(mockUser);
    setIsGuest(false);
    localStorage.setItem('pwa_user', JSON.stringify(mockUser));
    localStorage.removeItem('pwa_guest');
    return mockUser;
  };

  const signup = (name, email, password) => {
    const mockUser = {
      id: 'usr_' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(mockUser);
    setIsGuest(false);
    localStorage.setItem('pwa_user', JSON.stringify(mockUser));
    localStorage.removeItem('pwa_guest');
    return mockUser;
  };

  const skipAuth = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.setItem('pwa_guest', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('pwa_user');
    localStorage.removeItem('pwa_guest');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
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
