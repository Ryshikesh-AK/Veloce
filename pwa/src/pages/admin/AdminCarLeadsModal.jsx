import React, { useState } from 'react';

export default function AdminCarLeadsModal({ car, isOpen, onClose, leads = [], onUpdateLeadStatus, darkMode }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [notesDraft, setNotesDraft] = useState({});

  if (!isOpen || !car) return null;

  const carTitle = car.name || car.title || 'Vehicle';
  const carImage = car.image || car.imageUrl || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
  const carPrice = car.priceAmount
    ? `$${Number(car.priceAmount).toLocaleString()}`
    : car.pricePerDay
    ? `$${Number(car.pricePerDay).toLocaleString()}/day`
    : '$150,000';

  const relevantLeads = leads.filter(
    (l) => l.carId === car.id || l.carId === car.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  );

  const handleStatusChange = (leadId, newStatus) => {
    if (onUpdateLeadStatus) {
      onUpdateLeadStatus(leadId, newStatus);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-all animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          darkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b ${
            darkMode ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={carImage}
              alt={carTitle}
              className="h-12 w-16 object-cover rounded-xl border border-slate-700/50 shadow-xs shrink-0"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-rose-500/10 text-rose-500">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </span>
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Interested Customers & Leads
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {carTitle} • Valuation: <span className="font-bold text-emerald-500">{carPrice}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body: Customer List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Wishlist Inquiries ({relevantLeads.length})
              </span>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Clients who added this vehicle to their wishlist or expressed direct purchase interest.
              </p>
            </div>
            <div className="flex items-center gap-1.5 self-start">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Direct Call Ready
              </span>
            </div>
          </div>

          {relevantLeads.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 text-center space-y-3 ${
                darkMode ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-rose-500/10 text-rose-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-200">No customer wishlist leads yet for this vehicle.</p>
              <p className="text-xs max-w-sm mx-auto text-slate-400">
                When visitors or registered clients click "Save to Wishlist" on this car in the showroom, their contact profile will immediately appear here with one-click calling.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {relevantLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                    darkMode
                      ? 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                          {lead.customerName}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            lead.intentLevel === 'Ready to Buy'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : lead.intentLevel === 'High Intent'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {lead.intentLevel}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {lead.addedDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {lead.location}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-emerald-500">
                          Budget: {lead.budget}
                        </span>
                      </div>

                      {lead.notes && (
                        <p className={`text-xs mt-2 p-2.5 rounded-xl border italic ${
                          darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          "{lead.notes}"
                        </p>
                      )}
                    </div>

                    {/* Action Call & Follow-up Buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      {/* Call Phone Button */}
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all cursor-pointer no-underline"
                        title={`Call ${lead.customerName}`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                        </svg>
                        <span>Call Customer ({lead.phone})</span>
                      </a>

                      {/* Status Selector */}
                      <select
                        value={lead.callStatus}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition-all focus:outline-none cursor-pointer ${
                          darkMode ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-800'
                        }`}
                      >
                        <option value="Pending Call">Pending Call</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested / Negotiating</option>
                        <option value="Scheduled Test">Scheduled Test Drive</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-between px-5 sm:px-6 py-3.5 border-t text-xs ${
            darkMode ? 'border-slate-800/80 bg-slate-950/60 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
          }`}
        >
          <span>Direct luxury concierge connection</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:opacity-90 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
