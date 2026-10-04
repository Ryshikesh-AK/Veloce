import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCarContext } from '../context/CarContext';
import storageService from '../services/storageService';

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { darkMode, setDarkMode, toggleDarkMode, favorites, clearUserData } = useCarContext();
  const navigate = useNavigate();

  const guestInfo = storageService.getGuestUser();

  const handleLogout = () => {
    clearUserData();
    logout();
    navigate('/login');
  };

  const displayName = user?.name || guestInfo?.name || 'Guest User';
  const displayPhone = user?.phone || guestInfo?.phone;

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account & Profile</h1>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your account settings, theme preferences, and session.
          </p>
        </div>
        {isAdmin && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
            Admin Account
          </span>
        )}
      </div>

      {/* User Information Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 font-bold text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {displayName ? displayName.slice(0, 2).toUpperCase() : 'GU'}
          </div>
          <div>
            <h2 className="text-lg font-bold">{displayName}</h2>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {user?.email || (guestInfo ? 'Guest Session (Saved Details)' : 'Browsing in Guest Mode')}
            </p>
            {displayPhone && (
              <p className="text-xs text-emerald-400 font-medium mt-1">
                Guest_number: {displayPhone}
              </p>
            )}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between mt-2">
            <span>You are currently browsing as a guest.</span>
            <Link to="/login" className="font-bold underline hover:text-amber-200">
              Sign In Now
            </Link>
          </div>
        )}
      </div>

      {/* Theme Selection Section */}
      <div className={`p-5 rounded-2xl border transition-all ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className="text-sm font-bold tracking-tight mb-1">Appearance & Theme</h3>
        <p className={`text-xs mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Select your preferred visual style for the DriveXCars interface.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Dark Mode Option */}
          <button
            type="button"
            onClick={() => setDarkMode(true)}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              darkMode
                ? 'bg-slate-800 border-emerald-500 text-emerald-400 shadow-md ring-1 ring-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </div>
            <span className="text-xs font-bold">Dark Mode</span>
            {darkMode && <span className="text-[10px] text-emerald-400 font-semibold">Active</span>}
          </button>

          {/* Light Mode Option */}
          <button
            type="button"
            onClick={() => setDarkMode(false)}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              !darkMode
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md ring-1 ring-emerald-500'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold">Light Mode</span>
            {!darkMode && <span className="text-[10px] text-emerald-600 font-semibold">Active</span>}
          </button>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className={`p-5 rounded-2xl border transition-all ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className="text-sm font-bold tracking-tight mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Link
            to="/saved"
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              darkMode ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-rose-500">❤️</span>
              <span className="text-xs font-semibold">Saved Vehicles Wishlist</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
              {favorites.length} Saved
            </span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                darkMode ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-400">⚡</span>
                <span className="text-xs font-semibold">Admin Dashboard CRM</span>
              </div>
              <span className="text-xs font-bold text-amber-400">Open ➔</span>
            </Link>
          )}
        </div>
      </div>

      {/* Session Logout Action */}
      {isAuthenticated && (
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl border border-rose-500/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out of Session</span>
          </button>
        </div>
      )}
    </div>
  );
}
