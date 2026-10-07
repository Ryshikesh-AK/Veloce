import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  X, 
  Check, 
  ShieldCheck, 
  Award 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCarContext } from '../context/CarContext';
import { hapticAction, hapticTab } from '../utils/haptics';

export default function LoginPage({ initialMode = 'login' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, skipAuth, checkUserExists } = useAuth();
  const { darkMode, setToast } = useCarContext();

  // Mode: 'login' | 'signup' (Defaults strictly to 'login' unless path is /signup)
  const isSignupPath = location.pathname === '/signup';
  const [internalMode, setInternalMode] = useState(isSignupPath ? 'signup' : 'login');
  const mode = internalMode;

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [error, setError] = useState('');
  const [userNotFoundNotice, setUserNotFoundNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSwitch = (newMode) => {
    hapticTab();
    setInternalMode(newMode);
    setUserNotFoundNotice(false);
    setError('');
  };

  const handleClose = () => {
    hapticAction();
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGuestContinue = () => {
    hapticAction();
    skipAuth?.();
    setToast?.('Browsing in guest mode');
    navigate('/');
  };

  const handleQuickDemo = async (role) => {
    hapticAction();
    setIsLoading(true);
    setError('');
    setUserNotFoundNotice(false);

    const demoEmail = role === 'admin' ? 'admin@drivexcars.co.uk' : 'collector@drivexcars.co.uk';
    const demoPassword = 'DemoPassword123!';

    try {
      const loggedUser = await login(demoEmail, demoPassword);
      setToast?.(`Signed in as ${role === 'admin' ? 'Executive Admin' : 'VIP Collector'}`);
      if (loggedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Demo authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!fullName.trim() || !email.trim() || !password) {
        setError('Please enter your full name, email, and password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
      if (!agreeTerms) {
        setError('Please agree to the DriveX Collector Terms & Privacy Policy.');
        return;
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      // If user does not exist in registry, immediately transition to catchy Create Account mode!
      if (!checkUserExists?.(email.trim())) {
        hapticTab();
        setInternalMode('signup');
        setUserNotFoundNotice(true);
        if (password) setConfirmPassword(password);
        setError('');
        setToast?.('✨ No account found. Create your collector profile in seconds!');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }
    }

    hapticAction();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const newUser = await signup(fullName.trim(), email.trim(), password, phone.trim());
        setToast?.(`Welcome to DriveX, ${newUser?.name || fullName}!`);
        if (newUser?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const loggedUser = await login(email.trim(), password);
        setToast?.(`Welcome back, ${loggedUser?.name || 'Collector'}!`);
        if (loggedUser?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      if (mode === 'login' && (err.userNotFound || !checkUserExists?.(email.trim()))) {
        // User does not exist yet! Automatically present the catchy Create Account section
        setInternalMode('signup');
        setUserNotFoundNotice(true);
        if (password) setConfirmPassword(password);
        setError('');
        setToast?.('✨ No account found. Create your collector profile in seconds!');
        return;
      }
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`min-h-screen w-full flex flex-col justify-center relative transition-colors duration-300 ${
        darkMode ? 'bg-[#090e17] text-slate-100' : 'bg-[#FBFBFC] text-slate-900'
      }`}
      data-purpose="auth-screen"
    >
      {/* Background Ambient Glows */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors ${
        darkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/10'
      }`} />
      <div className={`absolute bottom-0 right-10 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors ${
        darkMode ? 'bg-teal-500/10' : 'bg-teal-500/10'
      }`} />

      {/* Main Responsive Grid Container (Split on Desktop, Compact on Mobile) */}
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 my-auto z-10">
        
        <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all grid grid-cols-1 lg:grid-cols-12 ${
          darkMode 
            ? 'bg-slate-900/90 border-white/10 shadow-black/40' 
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>
          
          {/* ======================================================== */}
          {/* LEFT COLUMN (5 Cols): LUXURY SHOWCASE & PRIVILEGES (Desktop) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden border-r border-white/10">
            
            {/* Background High-End Car Image Overlay */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
              <img 
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Supercar Showcase"
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            </div>

            {/* Top Branding */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DriveX Private Client</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight leading-snug">
                Own the Rare. <br />
                <span className="text-emerald-400 font-serif italic font-normal">Drive the Extraordinary.</span>
              </h2>
            </div>

            {/* Collector Privileges Checklist */}
            <div className="relative z-10 space-y-3.5 my-8">
              {[
                { title: 'Bespoke Sourcing', desc: 'Direct allocation access to unlisted hypercars' },
                { title: 'Private Showroom Viewings', desc: 'Closed-door appointments across 4 global flagships' },
                { title: 'Enclosed Carrier Delivery', desc: 'White-glove climate delivery to your private estate' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quote & Trust */}
            <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit Encrypted Session</span>
              </div>
              <span>DriveXCars Motors</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN (7 Cols): EXECUTIVE AUTH CONSOLE            */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Top Bar with Brand & Close Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-black text-sm">
                  DX
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">DriveX Cars</div>
                  <div className="text-[10px] text-slate-400">Luxury Client Portal</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#bef264]/15 border border-[#bef264]/30 text-[#bef264] text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-[#bef264]" />
                <span>{mode === 'login' ? 'Collector Portal' : 'Exclusive Access'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {mode === 'login' ? 'Welcome Back, Collector' : 'Create Your Account'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {mode === 'login' 
                  ? 'Sign in to access your garage wishlists, compare matrix, and private allocations.'
                  : 'Join DriveX in seconds to unlock bespoke hypercars, private viewings, and VIP perks.'}
              </p>
            </div>

            {/* Catchy Notice Banner if account was not found */}
            <AnimatePresence>
              {userNotFoundNotice && mode === 'signup' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-2xl bg-[#bef264]/15 border border-[#bef264]/40 text-slate-900 dark:text-white flex items-start gap-3 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#bef264] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-black text-xs">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-extrabold text-slate-950 dark:text-[#bef264] text-xs sm:text-sm">
                      ✨ No account found for this email!
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                      We've pre-filled <span className="font-bold underline decoration-[#bef264] text-slate-900 dark:text-white">{email}</span>. Just enter your name to complete your collector profile in seconds!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required={mode === 'signup'}
                      placeholder="Julian Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="client@drivexcars.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Phone (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>Phone / WhatsApp</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="+1 (415) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password *
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setToast?.('Password reset instructions sent to your email.')}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              )}

              {/* Checkboxes: Remember Me or Agree to Terms */}
              <div className="flex items-center justify-between text-xs pt-1">
                {mode === 'login' ? (
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20 border-slate-300 dark:border-slate-700"
                    />
                    <span>Remember this session</span>
                  </label>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 text-[11px]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20 border-slate-300 dark:border-slate-700"
                    />
                    <span>I agree to DriveX Privacy Policy & Collector Terms</span>
                  </label>
                )}
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[50px] rounded-2xl bg-[#bef264] hover:bg-[#aee750] text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#bef264]/20 cursor-pointer disabled:opacity-50 active:scale-[0.99] mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Garage' : 'Create Collector Account & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Intuitive Switcher Link */}
            <div className="text-center pt-0.5">
              {mode === 'login' ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      hapticTab();
                      setInternalMode('signup');
                      setUserNotFoundNotice(false);
                      setError('');
                    }}
                    className="font-bold text-slate-900 dark:text-[#bef264] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Create Account</span>
                    <span>→</span>
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Already have a collector account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      hapticTab();
                      setInternalMode('login');
                      setUserNotFoundNotice(false);
                      setError('');
                    }}
                    className="font-bold text-slate-900 dark:text-[#bef264] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Sign In instead</span>
                    <span>→</span>
                  </button>
                </p>
              )}
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block text-center">
                Instant Demo Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  disabled={isLoading}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:border-amber-500/30 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-500 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Demo Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  disabled={isLoading}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Demo Collector</span>
                </button>
              </div>
            </div>

            {/* Bottom Guest Option & Policy */}
            <div className="flex items-center justify-between text-xs pt-1 text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="hover:text-emerald-500 underline font-medium cursor-pointer"
              >
                Continue exploring as Guest →
              </button>
              <span className="text-[10px]">Encrypted & Confidential</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
