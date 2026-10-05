import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Car
} from 'lucide-react';
import { useCarContext } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { hapticAction } from '../utils/haptics';

export default function ContactPage() {
  const navigate = useNavigate();
  const { cars, darkMode, setToast } = useCarContext();
  const { user, isAuthenticated, isAdmin, switchRole } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    preferredVehicle: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      if (setToast) setToast('Please enter your name and email address.');
      return;
    }

    hapticAction();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (setToast) setToast('Your luxury inquiry has been received. A concierge advisor will contact you.');
    }, 700);
  };

  const handleReset = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      preferredVehicle: '',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div
      className={`min-h-[calc(100vh-80px)] pb-24 pt-2 transition-colors duration-200 ${
        darkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
      data-purpose="contact-hub-screen"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Hero Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#bef264]/20 text-emerald-600 dark:text-[#bef264] border border-[#bef264]/40">
            <span>VIP Showroom Concierge</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Connect with <span className="text-emerald-500">DriveXCars</span>
          </h1>
          <p className={`text-xs sm:text-sm max-w-2xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Experience private showroom viewings, bespoke bespoke vehicle sourcing, or tailor-made financing directly with our luxury acquisition team.
          </p>
        </div>

        {/* Authenticated Role Quick Switch Bar */}
        {isAuthenticated && (
          <div
            className={`p-3.5 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#bef264] text-slate-950 font-bold text-xs flex items-center justify-center">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <span className="text-xs font-bold block">{user?.name}</span>
                <span className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  darkMode ? 'border-slate-700 bg-slate-800 text-slate-200 hover:text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Switch to {isAdmin ? 'Customer' : 'Admin'} Role
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#bef264] text-slate-950 hover:bg-[#aee750] shadow-xs transition-all cursor-pointer"
                >
                  Admin Portal →
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2-Column Luxury Contact Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Sleek Contact Form (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
              darkMode
                ? 'bg-slate-900/70 border-slate-800/80 backdrop-blur-md'
                : 'bg-white border-slate-200/80 shadow-slate-100'
            }`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">
                <Car className="w-4 h-4" />
                <span>Private Consultation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Request Vehicle Consultation</h2>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Fill in your details below. Our luxury vehicle specialists reply within 2 hours.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#bef264]/20 border border-[#bef264]/50 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Inquiry Successfully Dispatched</h3>
                  <p className={`text-xs max-w-sm mx-auto mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Thank you, <strong className="text-slate-900 dark:text-slate-100">{form.name}</strong>. Our San Francisco showroom director has received your request regarding{' '}
                    <strong className="text-slate-900 dark:text-slate-100">{form.preferredVehicle || 'our luxury fleet'}</strong>.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      darkMode ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Send Another Message
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bef264] text-slate-950 hover:bg-[#aee750] transition-all cursor-pointer"
                  >
                    Browse Showroom →
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Julian Montgomery"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264] ${
                        darkMode
                          ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264] ${
                        darkMode
                          ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264] ${
                        darkMode
                          ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  {/* Preferred Vehicle */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Preferred Vehicle of Interest
                    </label>
                    <select
                      value={form.preferredVehicle}
                      onChange={(e) => setForm({ ...form, preferredVehicle: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264] cursor-pointer ${
                        darkMode
                          ? 'bg-slate-950/80 border-slate-800 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">Select a Vehicle (or General Inquiry)</option>
                      {cars.map((car) => (
                        <option key={car.id} value={car.title || car.name}>
                          {car.title || car.name} ({car.price || 'Inquire'})
                        </option>
                      ))}
                      <option value="Bespoke Sourcing">Bespoke Custom Vehicle Sourcing</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Message / VIP Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Specify delivery preferences, financing questions, trade-in details, or preferred appointment dates…"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264] resize-none ${
                      darkMode
                        ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[#bef264] hover:bg-[#aee750] text-slate-950 shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>{isSubmitting ? 'Sending Request…' : 'Send Inquiry →'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Premium Showroom Card & Location Hub (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Showroom Visual & Address Card */}
            <div
              className={`rounded-3xl border overflow-hidden p-6 sm:p-7 transition-all ${
                darkMode
                  ? 'bg-slate-900/70 border-slate-800/80 backdrop-blur-md'
                  : 'bg-white border-slate-200/80 shadow-sm'
              }`}
            >
              {/* Styled Map / Showroom Header Visual */}
              <div className="relative h-44 rounded-2xl overflow-hidden mb-6 border border-slate-700/30 group">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                  alt="DriveXCars San Francisco Flagship Showroom"
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#bef264] text-slate-950 w-max mb-1 shadow-xs">
                    <MapPin className="w-3 h-3" /> Flagship Showroom
                  </span>
                  <p className="text-xs font-bold text-white tracking-wide">
                    San Francisco Luxury Pavilion
                  </p>
                </div>
              </div>

              {/* Showroom Address */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#bef264]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Showroom Address</h3>
                    <p className={`text-sm font-semibold mt-0.5 leading-snug ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      1000 Van Ness Ave
                      <br />
                      San Francisco, CA 94109
                    </p>
                  </div>
                </div>

                {/* Opening Hours Badge */}
                <div className="flex items-start gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Opening Hours</h3>
                    <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Monday – Saturday, 9:00 AM – 8:00 PM</span>
                    </div>
                    <p className={`text-[11px] mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Sunday viewings by confirmed VIP appointment only.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Pill Cards */}
            <div className="space-y-2.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider block px-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Direct VIP Lines
              </span>

              {/* Phone Pill */}
              <a
                href="tel:+1234567890"
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all group no-underline ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850'
                    : 'bg-white border-slate-200/80 hover:border-emerald-400 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Call Showroom</div>
                    <div className={`text-xs font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>+1 (234) 567-890</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">
                  Call Now →
                </span>
              </a>

              {/* WhatsApp Pill */}
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all group no-underline ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850'
                    : 'bg-white border-slate-200/80 hover:border-emerald-400 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp Concierge</div>
                    <div className={`text-xs font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Instant Chat & Video Tours</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">
                  Chat Now →
                </span>
              </a>

              {/* Email Pill */}
              <a
                href="mailto:info@drivexcars.co.uk"
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all group no-underline ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850'
                    : 'bg-white border-slate-200/80 hover:border-emerald-400 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Correspondence</div>
                    <div className={`text-xs font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>info@drivexcars.co.uk</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Email →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
