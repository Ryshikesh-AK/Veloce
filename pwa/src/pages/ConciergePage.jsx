import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Headphones, 
  Award, 
  Truck,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCarContext } from '../context/CarContext';
import { hapticAction } from '../utils/haptics';

export default function ConciergePage() {
  const { user } = useAuth();
  const { setToast } = useCarContext();

  // Quick Message Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setToast?.('Please fill in your name, email, and message.');
      return;
    }

    hapticAction();
    setIsSubmitting(true);

    const newMessage = {
      id: 'msg-' + Date.now(),
      name: fullName.trim(),
      email: email.trim(),
      message: message.trim(),
      service: 'General Concierge Inquiry',
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('DriveXCars-admin-customer-leads') || '[]');
      existing.unshift({
        ...newMessage,
        status: 'new'
      });
      localStorage.setItem('DriveXCars-admin-customer-leads', JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to save message:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setToast?.('Message sent! Our concierge will reply within 15 minutes.');
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pb-36 space-y-8" data-purpose="concierge-screen">
      
      {/* ======================================================== */}
      {/* 1. HEADER BANNER & VIP STATUS STRIP                     */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            VIP CLIENT CONCIERGE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Direct Access to Automotive Excellence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Connect directly with our luxury concierge team for vehicle acquisitions, private consignments, and bespoke client services.
          </p>
        </div>

        {/* Live Concierge Desk Status Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 self-start md:self-auto shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Concierge Desk Live · Response &lt; 15 min</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DIRECT VIP CHANNELS BAR (Phone, WhatsApp, Email, Live) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* VIP Hotline */}
        <a
          href="tel:+14158904220"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Direct VIP Line</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">+1 (415) 890-4220</div>
            <span className="text-[10px] text-emerald-500 font-medium">9 AM – 8 PM Daily</span>
          </div>
        </a>

        {/* WhatsApp Private Line */}
        <a
          href="https://wa.me/14158904220?text=Hello%20DriveX%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20vehicle."
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">WhatsApp Desk</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Start Instant Chat</div>
            <span className="text-[10px] text-slate-400">Direct encrypted line</span>
          </div>
        </a>

        {/* Executive Desk Email */}
        <a
          href="mailto:vip@drivexcars.co.uk?subject=VIP%20Showroom%20Inquiry"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Executive Desk</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">vip@drivexcars.co.uk</div>
            <span className="text-[10px] text-slate-400">Formal allocations</span>
          </div>
        </a>

        {/* AI Virtual Advisor */}
        <div 
          onClick={() => {
            const chatBtn = document.querySelector('[data-purpose="chat-fab-toggle"]');
            if (chatBtn) chatBtn.click();
            else setToast?.('AI Concierge active in bottom corner');
          }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">AI Dream Advisor</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Chat Live Now</div>
            <span className="text-[10px] text-amber-500 font-medium">Instant 24/7 Intel</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DIRECT MESSAGE & CLIENT PRIVILEGES (2 Columns)        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Direct Message Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              DIRECT INQUIRY
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Send a Message to Concierge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Have a question about a vehicle or allocation? Leave a direct note.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Julian Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@drivexcars.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                    Your Inquiry or Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Inquire about allocation availability, pricing, or vehicle specifications..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#bef264] hover:bg-[#aee750] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-[#bef264]/20 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to Concierge</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Message Delivered</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Thank you, {fullName}. Our concierge desk will reply to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span> within 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold underline cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* White-Glove Client Privileges Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              EXCLUSIVE PRIVILEGES
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>DriveX Client Services</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every client receives tailored white-glove automotive advisory.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Enclosed White-Glove Transport</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Insured single-car climate carrier direct to your private residence, hangar, or collection facility.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Off-Market Allocation Access</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Priority access to unlisted hypercar builds, Paint-to-Sample slots, and verified collector provenance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Guaranteed Trade-In Equity</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Instant verified market pricing and seamless equity transfers for upgrading your personal collection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">150-Point Certified Inspection</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Every vehicle undergoes comprehensive technical audit and provenance certification before delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
