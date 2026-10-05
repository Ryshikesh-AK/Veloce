import React from 'react';
import { motion } from 'framer-motion';
import { hapticFilter } from '../../utils/haptics';

export default function SearchAndFilters({ 
  darkMode,
  searchQuery, 
  onSearchChange, 
  categories = ['All cars', 'Electric', 'Sports', 'SUV', 'MPV', 'Sedan', 'Hybrid'],
  selectedCategory, 
  onSelectCategory,
  sortBy = 'featured',
  onSortChange
}) {
  return (
    <section className="space-y-3 pt-1" data-purpose="search-and-filters">
      {/* Search Input Bar */}
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
          darkMode ? 'text-slate-400' : 'text-gray-400'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by model, make..."
          className={`w-full pl-10 pr-24 py-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs ${
            darkMode 
              ? 'bg-slate-900/80 border-white/10 text-white placeholder-slate-400' 
              : 'bg-white border-gray-200/90 text-gray-800 placeholder-gray-400'
          }`}
        />
        <div className="absolute inset-y-0 right-1.5 flex items-center">
          <select
            aria-label="Sort cars"
            value={sortBy}
            onChange={(event) => {
              hapticFilter();
              onSortChange(event.target.value);
            }}
            className={`max-w-[118px] appearance-none flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer focus:outline-none ${
              darkMode ? 'bg-slate-800/80 border-white/10 text-slate-300 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <svg className="pointer-events-none absolute right-2.5 h-3 w-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* Filter Pill Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-3">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                hapticFilter();
                onSelectCategory(cat);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 border-emerald-400'
                  : darkMode 
                    ? 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'bg-white border-gray-200/90 text-gray-600 hover:text-gray-900 active:bg-gray-50'
              }`}
            >
              {cat}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
