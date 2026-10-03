import React from 'react';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';
import AdminGarageSection from './AdminGarageSection';

export default function AdminInventoryPage() {
  const { darkMode } = useCarContext();

  return (
    <div
      className={`min-h-screen pb-28 pt-4 transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNavTabs
          title="Car Garage"
          subtitle="Full showroom fleet management: add, edit, monitor availability, filter, and delete vehicles."
        />

        <AdminGarageSection />
      </div>
    </div>
  );
}
