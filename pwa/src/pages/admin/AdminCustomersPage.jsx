import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';
import { INITIAL_LEADS, CUSTOMER_LEADS_STORAGE_KEY } from '../../data/customerLeads';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { hapticFilter } from '../../utils/haptics';

export default function AdminCustomersPage() {
  const { cars, darkMode, setToast } = useCarContext();
  const [leads, setLeads] = useLocalStorage(CUSTOMER_LEADS_STORAGE_KEY, INITIAL_LEADS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLeads = leads.filter((lead) => {
    const q = search.toLowerCase().trim();
    const matchedCar = cars.find(
      (c) => c.id === lead.carId || c.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === lead.carId
    );
    const carTitle = (matchedCar?.title || matchedCar?.name || lead.carId || '').toLowerCase();

    const matchSearch =
      !q ||
      lead.customerName.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.location.toLowerCase().includes(q) ||
      carTitle.includes(q);

    const matchStatus = statusFilter === 'All' || lead.callStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, callStatus: newStatus } : l))
    );
    if (setToast) {
      setToast({
        id: Date.now(),
        message: `Updated lead status to "${newStatus}"`,
        type: 'success'
      });
    }
  };

  const handleExportCSV = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      if (setToast) {
        setToast({
          id: Date.now(),
          message: 'No customer leads available to export.',
          type: 'error'
        });
      }
      return;
    }

    const headers = [
      'Customer Name',
      'Phone Number',
      'Email Address',
      'Location',
      'Wishlisted Vehicle',
      'Intent Level',
      'Estimated Budget',
      'Call Status',
      'Date Added',
      'Notes'
    ];

    const rows = filteredLeads.map((lead) => {
      const matchedCar = cars.find(
        (c) => c.id === lead.carId || c.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === lead.carId
      );
      const vehicleName = matchedCar?.name || matchedCar?.title || lead.carId || 'Unknown Model';

      return [
        `"${(lead.customerName || '').replace(/"/g, '""')}"`,
        `"${(lead.phone || '').replace(/"/g, '""')}"`,
        `"${(lead.email || '').replace(/"/g, '""')}"`,
        `"${(lead.location || '').replace(/"/g, '""')}"`,
        `"${vehicleName.replace(/"/g, '""')}"`,
        `"${(lead.intentLevel || '').replace(/"/g, '""')}"`,
        `"${(lead.budget || '').replace(/"/g, '""')}"`,
        `"${(lead.callStatus || '').replace(/"/g, '""')}"`,
        `"${(lead.addedDate || '').replace(/"/g, '""')}"`,
        `"${(lead.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `drivexcars_customer_leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (setToast) {
      setToast({
        id: Date.now(),
        message: `Exported ${filteredLeads.length} customer lead(s) to CSV!`,
        type: 'success'
      });
    }
  };

  return (
    <div
      className={`min-h-screen pb-28 pt-4 transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNavTabs
          title="Customer Wishlist Leads"
          subtitle="Direct high-intent buyers who wishlisted showroom cars. Call clients directly to close purchases or schedule VIP handovers."
          actions={
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              title="Download customer leads as CSV spreadsheet"
            >
              <svg className="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV ({filteredLeads.length})</span>
            </button>
          }
        />



        {/* Lead Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className={`p-4 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Buyer Leads
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-2xl font-extrabold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {leads.length}
              </span>
              <span className="text-xs text-slate-400">Wishlists</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">
              Pending Call
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-500">
                {leads.filter((l) => l.callStatus === 'Pending Call').length}
              </span>
              <span className="text-xs text-slate-400">Needs Follow-up</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
              Ready to Buy
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-500">
                {leads.filter((l) => l.intentLevel === 'Ready to Buy').length}
              </span>
              <span className="text-xs text-slate-400">High Conversion</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Contacted / Active
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-blue-500">
                {leads.filter((l) => l.callStatus === 'Contacted' || l.callStatus === 'Interested').length}
              </span>
              <span className="text-xs text-slate-400">In Pipeline</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          className={`rounded-2xl border p-4 shadow-xs backdrop-blur-md transition-colors ${
            darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Shortened placeholder with inline magnifying glass icon on the left */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search customers or cars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-xl border pl-9 pr-4 py-2 text-xs transition-all focus:outline-none focus:ring-2 ${
                  darkMode
                    ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-[#bef264]'
                    : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-[#bef264]'
                }`}
              />
            </div>

            {/* Status Buttons in a Single Horizontal Scroll Row (prevent wrap, lime active, soft grey inactive) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
              {['All', 'Pending Call', 'Contacted', 'Interested'].map((st) => {
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      hapticFilter();
                      setStatusFilter(st);
                    }}
                    className={`rounded-lg px-3 py-1 text-xs transition-all duration-150 cursor-pointer select-none ${
                      isActive
                        ? 'bg-[#bef264] text-black font-semibold shadow-xs scale-102'
                        : darkMode
                        ? 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div
          className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
            darkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className={`border-b font-semibold uppercase tracking-wider ${
                    darkMode ? 'border-slate-800 bg-slate-950/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <th scope="col" className="px-4 py-3.5">Customer</th>
                  <th scope="col" className="px-4 py-3.5">Wishlisted Car</th>
                  <th scope="col" className="px-4 py-3.5">Intent / Budget</th>
                  <th scope="col" className="px-4 py-3.5">Inquiry Notes</th>
                  <th scope="col" className="px-4 py-3.5">Call Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Direct Call Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${darkMode ? 'divide-slate-800/80' : 'divide-slate-200'}`}>
                {filteredLeads.map((lead) => {
                  const matchedCar = cars.find(
                    (c) => c.id === lead.carId || c.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === lead.carId
                  );

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors ${
                        darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {lead.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lead.email} • {lead.location}
                        </div>
                      </td>

                      {/* Wishlisted Car */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {matchedCar && (
                            <img
                              src={matchedCar.image || matchedCar.imageUrl}
                              alt={matchedCar.name || matchedCar.title}
                              className="h-8 w-12 object-cover rounded-md border border-slate-700/40 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          )}
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {matchedCar?.name || matchedCar?.title || lead.carId}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Added {lead.addedDate}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Intent & Budget */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            lead.intentLevel === 'Ready to Buy'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : lead.intentLevel === 'High Intent'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {lead.intentLevel}
                        </span>
                        <div className="text-[11px] font-semibold text-emerald-500 mt-1">
                          Budget: {lead.budget}
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 italic truncate">
                          "{lead.notes}"
                        </p>
                      </td>

                      {/* Call Status Dropdown */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={lead.callStatus}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className={`rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all focus:outline-none cursor-pointer ${
                            lead.callStatus === 'Pending Call'
                              ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                              : 'border-slate-700 bg-slate-900 text-slate-200'
                          }`}
                        >
                          <option value="Pending Call">Pending Call</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                        </select>
                      </td>

                      {/* Direct Call Button */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition-all cursor-pointer no-underline"
                          title={`Call ${lead.customerName} on ${lead.phone}`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                          </svg>
                          <span>Call {lead.phone}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
