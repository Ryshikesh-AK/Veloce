import React from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';
import AdminGarageSection from './AdminGarageSection';

export default function AdminInventoryPage() {
  const { darkMode } = useCarContext();

  return (
    <div
      className={`min-h-screen pb-24 md:pb-12 pt-4 transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <AdminNavTabs
          title="Car Garage"
          subtitle="Full showroom fleet management: add, edit, monitor availability, filter, and delete vehicles."
          actions={
            <Link
              to="/admin/new"
              className="hidden md:inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-[#b9f43d] hover:from-emerald-300 hover:to-[#a8e630] shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer no-underline text-center"
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add Vehicle to Garage</span>
            </Link>
          }
        />

        <AdminGarageSection />
      </div>
    </div>
  );
}
