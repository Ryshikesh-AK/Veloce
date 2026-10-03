import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeading from '../components/common/ScreenHeading';
import { useAuth } from '../context/AuthContext';

export default function ConciergePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, switchRole, logout } = useAuth();

  return (
    <section className="space-y-5 max-w-xl mx-auto" data-purpose="concierge-screen">
      <ScreenHeading
        eyebrow="DriveXCars MOTORS"
        title="A little help goes a long way."
        description="Speak with our showroom team about a vehicle, financing, or your account profile."
      />

      {isAuthenticated && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">{user?.name}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                isAdmin
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              Role: {user?.role || 'customer'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
              className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              Switch to {isAdmin ? 'Customer' : 'Admin'} Role
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg shadow-sm transition"
              >
                Go to Admin Portal →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 border-y border-white/10 py-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Showroom</div>
          <p className="mt-1 text-sm leading-6 text-slate-200">
            1000 Van Ness Ave
            <br />
            San Francisco, CA
          </p>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Hours</div>
          <p className="mt-1 text-sm text-slate-200">Monday to Saturday, 9:00 AM to 8:00 PM</p>
        </div>
        <a
          className="flex min-h-12 items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950 hover:bg-emerald-300 transition-colors"
          href="tel:+1234567890"
        >
          Call +1 (234) 567-890
        </a>
        <a
          className="flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          href="mailto:info@drivexcars.co.uk"
        >
          Email info@drivexcars.co.uk
        </a>
      </div>
      <button
        type="button"
        className="min-h-11 text-sm font-semibold text-emerald-300 hover:text-emerald-200 cursor-pointer"
        onClick={() => navigate('/')}
      >
        Continue browsing cars →
      </button>
    </section>
  );
}
