import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useCarContext } from '../../context/CarContext';
import { sendConciergeMessage } from '../../services/aiService';
import { hapticAction, hapticTab } from '../../utils/haptics';

const STARTER_PROMPTS = [
  'Cars under $130k',
  'Fastest electric',
  'Compare 911 vs RS e-tron',
];

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'model',
    content:
      'Welcome to DriveXCars. I am your AI Luxury Concierge. How may I assist your automotive acquisition today?',
    time: 'Just now',
  },
];

export default function ChatConcierge() {
  const { cars, darkMode } = useCarContext();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input on open
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages]);

  const handleToggle = () => {
    hapticTab();
    setIsOpen((prev) => !prev);
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    hapticAction();
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build history for the model
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const replyText = await sendConciergeMessage(text, history, cars);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: 'I apologize for the momentary lapse. Our concierge service is at full capacity. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) positioned bottom-20 on mobile (clear of bottom dock) & bottom-6 on desktop */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleToggle}
          aria-label={isOpen ? 'Close AI Concierge' : 'Open AI Concierge'}
          className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 shadow-xl shadow-black/40 cursor-pointer transition-all duration-200"
        >
          {/* Subtle brand lime glow pulse */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#bef264]/40 to-emerald-400/20 blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <X className="w-5 h-5 text-slate-200 group-hover:text-white transition-transform group-hover:rotate-90 duration-200" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#bef264] group-hover:scale-110 transition-transform duration-200" />
            )}
          </div>

          {/* Unread badge indicator */}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-[#bef264] border-2 border-slate-950 rounded-full" />
          )}
        </motion.button>
      </div>

      {/* Modern Chat Window / Drawer: Bottom-sheet on mobile, floating widget card on desktop */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-end md:items-end justify-center md:justify-end md:p-6">
            {/* Backdrop on mobile for focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToggle}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs md:hidden pointer-events-auto"
            />

            {/* Chat Box Container */}
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className={`pointer-events-auto w-full md:w-[400px] h-[85vh] max-h-[580px] md:h-[540px] rounded-t-3xl md:rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
                darkMode
                  ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/80 backdrop-blur-xl'
                  : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60 backdrop-blur-xl'
              }`}
            >
              {/* Header */}
              <div
                className={`px-5 py-4 border-b flex items-center justify-between shrink-0 transition-colors ${
                  darkMode ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-100 bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 flex items-center justify-center text-slate-950 dark:text-[#bef264]">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#bef264]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold tracking-tight">DriveX AI Concierge</h3>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    </div>
                    <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Powered by Gemini 2.5 Flash • Live Fleet
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    darkMode
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  aria-label="Close concierge chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full bg-[#bef264] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#bef264] text-slate-950 font-medium rounded-tr-xs shadow-sm'
                            : darkMode
                            ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-xs'
                            : 'bg-slate-100 border border-slate-200/70 text-slate-800 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span
                          className={`block text-[9px] mt-1 text-right ${
                            isUser ? 'text-slate-800/80' : darkMode ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                      {isUser && (
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                          <User className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1">
                    <div className="w-6 h-6 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 flex items-center justify-center">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    </div>
                    <span>Consulting showroom inventory…</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Starter Pills */}
              <div className="px-4 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-all cursor-pointer shrink-0 ${
                      darkMode
                        ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-[#bef264]/50 hover:text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#bef264] hover:text-slate-900'
                    }`}
                  >
                    ✨ {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className={`p-3 border-t flex items-center gap-2 shrink-0 transition-colors ${
                  darkMode ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-100 bg-white'
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about specs, models, or pricing…"
                  disabled={isLoading}
                  className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264] ${
                    darkMode
                      ? 'bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  aria-label="Send message"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    inputMessage.trim() && !isLoading
                      ? 'bg-[#bef264] text-slate-950 font-bold hover:bg-[#aee750] shadow-sm'
                      : 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-slate-700/30'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
