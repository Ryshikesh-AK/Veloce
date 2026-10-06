import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  Check, 
  Edit3, 
  LogOut, 
  Bell, 
  Award, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCarContext } from '../context/CarContext';
import storageService from '../services/storageService';
import { hapticAction, hapticTab } from '../utils/haptics';

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout, switchRole, updateUser } = useAuth();
  const { clearUserData, setToast } = useCarContext();
  const navigate = useNavigate();

  const guestInfo = storageService.getGuestUser();

  // Profile Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || guestInfo?.name || '');
  const [emailInput, setEmailInput] = useState(user?.email || guestInfo?.email || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || guestInfo?.phone || '');
  const [preferredCity, setPreferredCity] = useState(
    user?.preferredCity || guestInfo?.preferredCity || 'San Francisco'
  );

  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('drivexcars_notifications')) || {
        newArrivals: true,
        priceDrops: true,
        conciergeAlerts: true,
      };
    } catch {
      return { newArrivals: true, priceDrops: true, conciergeAlerts: true };
    }
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    hapticAction();

    const updatedData = {
      name: nameInput.trim() || 'Collector',
      email: emailInput.trim(),
      phone: phoneInput.trim(),
      preferredCity
    };

    if (isAuthenticated && updateUser) {
      updateUser(updatedData);
    } else {
      storageService.setGuestUser(updatedData);
    }

    setIsEditing(false);
    setToast?.('Client profile details updated successfully!');
  };

  const toggleNotification = (key) => {
    hapticAction();
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('drivexcars_notifications', JSON.stringify(updated));
    setToast?.('Notification preferences saved');
  };

  const handleLogout = () => {
    hapticAction();
    clearUserData?.();
    logout();
    setToast?.('Logged out of executive session');
    navigate('/login');
  };

  const displayName = user?.name || guestInfo?.name || (isAuthenticated ? 'DriveX Member' : 'Guest Collector');
  const displayEmail = user?.email || guestInfo?.email || 'guest@drivexcars.co.uk';
  const displayPhone = user?.phone || guestInfo?.phone || '+1 (415) 555-0199';

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 pb-36 space-y-6" data-purpose="profile-screen">
      
      {/* ======================================================== */}
      {/* 1. HEADER BANNER & ACCOUNT STATUS                       */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            VIP CLIENT ACCOUNT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Client Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Manage your collector credentials, contact information, and alert preferences.
          </p>
        </div>

        {/* Member Tier Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isAdmin ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-500 dark:text-amber-400 border border-amber-400/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Executive Admin</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Apex VIP Collector</span>
            </span>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN USER IDENTITY CARD & EDIT PROFILE               */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            CLIENT CREDENTIALS
          </span>
          <button
            type="button"
            onClick={() => {
              hapticTab();
              setIsEditing(!isEditing);
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Profile Avatar & Details Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            {displayName ? displayName.slice(0, 2).toUpperCase() : 'DR'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {displayName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {displayEmail} {displayPhone ? `• ${displayPhone}` : ''}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                {isAuthenticated ? 'Verified Member' : 'Guest Collector Session'}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Hub: {preferredCity}
              </span>
            </div>
          </div>
        </div>

        {/* Guest Sign-In Upsell Banner */}
        {!isAuthenticated && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Unlock DriveX Executive Privileges
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Save collections across devices and receive private off-market allocations.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/10 transition cursor-pointer"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Inline Profile Editing Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSaveProfile}
              className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Update Collector Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Direct Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+1 (415) 555-0199"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Primary Showroom Hub</label>
                  <select
                    value={preferredCity}
                    onChange={(e) => setPreferredCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="San Francisco">San Francisco Flagship</option>
                    <option value="Beverly Hills">Beverly Hills Private Atelier</option>
                    <option value="New York">Manhattan Gallery</option>
                    <option value="London Mayfair">London Mayfair Lounge</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </div>

      {/* ======================================================== */}
      {/* 3. CLIENT NOTIFICATION ALERT SUBSCRIPTIONS              */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          <span>Alert Subscriptions</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Control notifications for vehicle availability and allocations.
        </p>

        <div className="space-y-2 pt-1 text-xs">
          {[
            { key: 'newArrivals', label: 'New Hypercar Arrivals', desc: 'Instant alert when rare allocations drop' },
            { key: 'priceDrops', label: 'Price & Lease Reductions', desc: 'Alerts when saved vehicles adjust pricing' },
            { key: 'conciergeAlerts', label: 'VIP Concierge Updates', desc: 'Private direct messages regarding viewings' }
          ].map((item) => (
            <div 
              key={item.key}
              onClick={() => toggleNotification(item.key)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 cursor-pointer hover:border-slate-300 transition"
            >
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">{item.label}</div>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition ${
                notifications[item.key] ? 'bg-emerald-500 text-slate-950' : 'bg-slate-300 dark:bg-slate-700 text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ADMIN TOOLS OR ROLE SWITCHER                         */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 dark:text-slate-300">Executive Testing Tools</span>
          <button
            type="button"
            onClick={() => {
              hapticAction();
              switchRole(isAdmin ? 'customer' : 'admin');
            }}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Switch to {isAdmin ? 'Customer' : 'Admin'}
          </button>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch Admin CRM Dashboard</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. SESSION LOGOUT ACTION                                */}
      {/* ======================================================== */}
      {isAuthenticated && (
        <div className="pt-1">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full min-h-[48px] rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 dark:text-rose-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of Session</span>
          </button>
        </div>
      )}

    </div>
  );
}
