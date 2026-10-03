import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarContext } from '../context/CarContext';
import { motion } from 'framer-motion';
import { hapticTab } from '../utils/haptics';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, skipAuth } = useAuth();
  const { darkMode, toggleDarkMode } = useCarContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    signup(name, email, password);
    navigate('/');
  };

  const handleSkip = () => {
    skipAuth();
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col justify-between px-6 py-4 relative transition-colors duration-300 ${
        darkMode ? 'bg-[#0b121d] text-slate-100' : 'bg-[#FBFBFC] text-slate-900'
      }`}
      data-purpose="signup-screen"
    >
      {/* Background ambient lighting */}
      <div className={`absolute top-[-10%] right-[20%] w-[320px] h-[320px] rounded-full blur-[100px] pointer-events-none transition-colors ${
        darkMode ? 'bg-[#b9f43d]/10' : 'bg-emerald-500/10'
      }`} />

      {/* Main Signup Form Container */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Create <em className="not-italic font-serif font-normal text-emerald-500">Account</em>
          </h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Unlock VIP test drive bookings, concierge messaging, and saved vehicle sync.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              required
              className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                darkMode 
                  ? 'bg-[#142131] border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                darkMode 
                  ? 'bg-[#142131] border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                darkMode 
                  ? 'bg-[#142131] border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                darkMode 
                  ? 'bg-[#142131] border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm mt-3 cursor-pointer"
          >
            <span>Create Account</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-500 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className={`text-center text-[11px] z-10 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span>DriveXCars Platform • Terms & Privacy</span>
      </div>
    </div>
  );
}
