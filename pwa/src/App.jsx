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
          ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
          : 'bg-[#FBFBFC] text-slate-900 selection:bg-emerald-500 selection:text-slate-950'
      }`}
    >
      {/* Universal Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className={`pwa-main flex-1 ${isAuthPage ? 'flex flex-col pt-0 px-0 max-w-full' : 'space-y-4 pt-3 px-4 max-w-7xl mx-auto w-full'}`} data-purpose="main-content">
        {inventoryError && (
          <div
            className="pwa-inventory-error rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100 flex items-center justify-between"
            role="status"
          >
            <span>Live inventory is unavailable. {inventoryError}</span>
            <button
              type="button"
              className="ml-2 font-semibold underline cursor-pointer"
              onClick={retryFetch}
            >
              Retry
            </button>
          </div>
        )}
        {carsLoading && <div className="text-xs text-slate-400" role="status">Loading DriveXCars inventory…</div>}

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
