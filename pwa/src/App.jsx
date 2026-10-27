import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import NavigationHeader from './components/layout/NavigationHeader';
import FloatingBottomDock from './components/layout/FloatingBottomDock';
import Toast from './components/common/Toast';
import ChatConcierge from './components/chat/ChatConcierge';
import AppRouter from './components/router/AppRouter';
import { CarProvider, useCarContext } from './context/CarContext';
import { AuthProvider } from './context/AuthContext';

function AppShell() {
  const { darkMode, inventoryError, carsLoading, retryFetch, toast } = useCarContext();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div
      data-theme={darkMode ? 'dark' : 'light'}
      className={`pwa-shell w-full ${isAuthPage ? 'min-h-screen overflow-y-auto' : 'min-h-screen pb-32'} flex flex-col relative transition-colors duration-300 ${
        darkMode
          ? 'bg-[#0b121d] text-slate-100 selection:bg-[#bef264] selection:text-slate-950'
          : 'bg-[#fbfbfc] text-slate-900 selection:bg-[#bef264] selection:text-slate-950'
      }`}
    >
      {/* Universal Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className={`pwa-main flex-1 ${isAuthPage ? 'flex flex-col pt-0 px-0 max-w-full' : 'space-y-5 pt-3 px-3.5 sm:px-6 max-w-7xl mx-auto w-full'}`} data-purpose="main-content">
        {inventoryError && (
          <div
            className="pwa-inventory-error rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-200 dark:text-amber-100 flex items-center justify-between shadow-xs"
            role="status"
          >
            <span>Live showroom inventory is currently unavailable. {inventoryError}</span>
            <button
              type="button"
              className="ml-3 px-3 py-1 rounded-lg border border-amber-400/40 font-bold hover:bg-amber-400/20 transition cursor-pointer text-amber-100"
              onClick={retryFetch}
            >
              Retry
            </button>
          </div>
        )}
        {carsLoading && (
          <div className="py-2 text-xs font-semibold text-slate-400 flex items-center gap-2" role="status">
            <span className="w-2 h-2 rounded-full bg-[#bef264] animate-ping" />
            <span>Connecting to DriveXCars inventory…</span>
          </div>
        )}

        {/* View Router */}
        <AppRouter />
      </main>

      {/* Floating Bottom Navigation (Hidden on Auth pages) */}
      {!isAuthPage && <FloatingBottomDock />}

      {/* DriveX AI Luxury Concierge Floating FAB & Chat Drawer */}
      {!isAuthPage && <ChatConcierge />}

      {/* Feedback Toast */}
      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarProvider>
          <AppShell />
        </CarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
