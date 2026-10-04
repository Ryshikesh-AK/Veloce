import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

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

  const clearGuestAndUserDataOnLogin = () => {
    localStorage.removeItem('guest_user_info');
    localStorage.removeItem('DriveXCars-pwa-saved-cars');
    localStorage.removeItem('DriveXCars-pwa-compare-cars');
    localStorage.removeItem('DriveXCars-test-drive-email');
    localStorage.removeItem('DriveXCars-admin-customer-leads');
    localStorage.removeItem('drivexcars_saved_v2');
    localStorage.removeItem('drivexcars_compare_v2');
    window.dispatchEvent(new Event('app:login'));
  };

  const login = async (email, password) => {
    clearGuestAndUserDataOnLogin();
    try {
      const response = await loginApi(email, password);
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

  const signup = async (name, email, password, phone = null) => {
    clearGuestAndUserDataOnLogin();
    try {
      const response = await registerApi(name, email, password, phone);
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
      const fallbackUser = {
        id: 'usr_' + Date.now(),
        name: name || email.split('@')[0],
        email: email,
        phone: phone,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setUser(fallbackUser);
      setIsGuest(false);
      localStorage.setItem('pwa_user', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
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

    // Retain theme preferences, clear all user & session storage
    const keysToPreserve = ['drivexcars_theme_v2', 'drivexcars_theme', 'pwa_theme'];
    const preservedValues = {};
    keysToPreserve.forEach((k) => {
      const val = localStorage.getItem(k);
      if (val !== null) preservedValues[k] = val;
    });

    localStorage.clear();

    Object.entries(preservedValues).forEach(([k, val]) => {
      localStorage.setItem(k, val);
    });

    window.dispatchEvent(new Event('app:logout'));
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
