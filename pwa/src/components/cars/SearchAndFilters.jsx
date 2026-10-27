import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
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
    <section className="space-y-3.5 pt-1" data-purpose="search-and-filters">
      {/* Search Input Bar & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search make, model, or trim..."
            className={`w-full pl-10 pr-10 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264]/50 focus:border-[#bef264] ${
              darkMode 
                ? 'bg-[#142131]/90 border-white/10 text-white placeholder-slate-400' 
                : 'bg-white border-slate-200/90 text-slate-900 placeholder-slate-400 shadow-xs'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors ${
                darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              }`}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <label htmlFor="inventory-sort" className="sr-only">Sort collection</label>
          <select
            id="inventory-sort"
            aria-label="Sort collection"
            value={sortBy}
            onChange={(event) => {
              hapticFilter();
              onSortChange(event.target.value);
            }}
            className={`w-full sm:w-auto appearance-none pl-3.5 pr-8 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#bef264]/50 focus:border-[#bef264] ${
              darkMode 
                ? 'bg-[#142131]/90 border-white/10 text-slate-200 hover:bg-[#1a2b3f]' 
                : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <option value="featured">Featured Collection</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div 
        className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1"
        role="tablist"
        aria-label="Vehicle categories"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <motion.button
              key={cat}
              role="tab"
              aria-selected={isActive}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                hapticFilter();
                onSelectCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] ${
                isActive
                  ? 'bg-[#bef264] text-slate-950 font-bold shadow-md shadow-[#bef264]/20 border-[#bef264]'
                  : darkMode 
                    ? 'bg-[#142131]/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-white/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-xs'
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
