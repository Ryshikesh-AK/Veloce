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

  const DEFAULT_ACCOUNTS = [
    { email: 'admin@drivexcars.co.uk', password: 'DemoPassword123!', name: 'Executive Admin', role: 'admin' },
    { email: 'admin@example.com', password: 'test-password', name: 'System Admin', role: 'admin' },
    { email: 'collector@drivexcars.co.uk', password: 'DemoPassword123!', name: 'VIP Collector', role: 'customer' },
  ];

  const getRegisteredAccounts = () => {
    try {
      const raw = localStorage.getItem('drivexcars_registered_users');
      if (!raw) {
        try {
          localStorage.setItem('drivexcars_registered_users', JSON.stringify(DEFAULT_ACCOUNTS));
        } catch {}
        return [...DEFAULT_ACCOUNTS];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default accounts remain available
        let changed = false;
        const merged = [...parsed];
        for (const def of DEFAULT_ACCOUNTS) {
          if (!merged.some((a) => a?.email?.toLowerCase() === def.email.toLowerCase())) {
            merged.push(def);
            changed = true;
          }
        }
        if (changed) {
          try {
            localStorage.setItem('drivexcars_registered_users', JSON.stringify(merged));
          } catch {}
        }
        return merged;
      }
      return [...DEFAULT_ACCOUNTS];
    } catch {
      return [...DEFAULT_ACCOUNTS];
    }
  };

  const saveRegisteredAccount = (newAccount) => {
    if (!newAccount?.email) return;
    try {
      const cleanEmail = newAccount.email.trim().toLowerCase();
      const accounts = getRegisteredAccounts();
      const existingIndex = accounts.findIndex(
        (a) => a?.email && a.email.trim().toLowerCase() === cleanEmail
      );
      const entry = {
        ...newAccount,
        email: cleanEmail,
      };
      if (existingIndex >= 0) {
        accounts[existingIndex] = { ...accounts[existingIndex], ...entry };
      } else {
        accounts.push(entry);
      }
      localStorage.setItem('drivexcars_registered_users', JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save registered account to localStorage', e);
    }
  };

  const checkUserExists = (email) => {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getRegisteredAccounts();
    return accounts.some((a) => a?.email && a.email.trim().toLowerCase() === cleanEmail);
  };

  const login = async (email, password) => {
    clearGuestAndUserDataOnLogin();
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await loginApi(cleanEmail, password);
      const userSession = {
        ...response.user,
        token: response.access_token,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      saveRegisteredAccount({
        email: cleanEmail,
        name: userSession.name,
        role: userSession.role,
        password,
      });
      setUser(userSession);
      setIsGuest(false);
      localStorage.setItem('pwa_user', JSON.stringify(userSession));
      return userSession;
    } catch (error) {
      // Local fallback account check
      const accounts = getRegisteredAccounts();
      const matched = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

      if (!matched) {
        const notFoundErr = new Error('No account found for this email.');
        notFoundErr.userNotFound = true;
        throw notFoundErr;
      }

      // User exists, verify password if one was set
      if (matched.password && matched.password !== password) {
        throw new Error('Incorrect password. Please verify and try again.');
      }

      const userSession = {
        id: matched.id || 'usr_' + Date.now(),
        name: matched.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: matched.phone || null,
        role: matched.role || (cleanEmail.includes('admin') ? 'admin' : 'customer'),
        avatar: matched.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      setUser(userSession);
      setIsGuest(false);
      localStorage.setItem('pwa_user', JSON.stringify(userSession));
      return userSession;
    }
  };

  const signup = async (name, email, password, phone = null) => {
    clearGuestAndUserDataOnLogin();
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await registerApi(name, cleanEmail, password, phone);
      const userSession = {
        ...response.user,
        token: response.access_token,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      saveRegisteredAccount({
        id: userSession.id,
        name,
        email: cleanEmail,
        password,
        phone,
        role: userSession.role || 'customer',
      });
      setUser(userSession);
      setIsGuest(false);
      localStorage.setItem('pwa_user', JSON.stringify(userSession));
      return userSession;
    } catch (error) {
      console.error('Registration failed on backend:', error);
      throw error;
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

    // Retain registered users database, theme preferences, and saved configurations
    const keysToPreserve = [
      'drivexcars_registered_users',
      'drivexcars_theme_v2', 
      'drivexcars_theme', 
      'pwa_theme'
    ];
    const preservedValues = {};
    keysToPreserve.forEach((k) => {
      const val = localStorage.getItem(k);
      if (val !== null) preservedValues[k] = val;
    });

    // Remove active user session credentials
    localStorage.removeItem('pwa_user');
    localStorage.removeItem('pwa_token');
    localStorage.removeItem('guest_user_info');
    localStorage.removeItem('DriveXCars-admin-customer-leads');
    localStorage.removeItem('DriveXCars-test-drive-email');

    // Guarantee preserved data is intact
    Object.entries(preservedValues).forEach(([k, val]) => {
      localStorage.setItem(k, val);
    });

    window.dispatchEvent(new Event('app:logout'));
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('pwa_user', JSON.stringify(updatedUser));
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
        updateUser,
        switchRole,
        skipAuth,
        logout,
        checkUserExists,
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
