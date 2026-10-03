import React, { useState, useEffect } from 'react';
import { useCarContext } from '../../context/CarContext';

const CATEGORIES = ['Sports', 'Electric', 'SUV', 'Luxury', 'Supercar'];
const TRANSMISSIONS = ['Automatic', 'PDK Dual-Clutch', 'Manual'];
const DRIVETRAINS = ['AWD', 'RWD', 'FWD'];
const FUEL_TYPES = ['Gasoline', 'Electric', 'Hybrid'];
const STATUSES = ['available', 'reserved', 'sold'];

export default function AdminEditModal({ car, isOpen, onClose, onSave }) {
  const { darkMode, updateCar } = useCarContext();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Sports',
    priceAmount: '',
    location: '',
    description: '',
    imageUrl: '',
    horsepower: '',
    topSpeed: '',
    acceleration: '',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    fuelType: 'Gasoline',
    status: 'available',
    isFeatured: false
  });

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title || car.name || '',
        brand: car.brand || (car.title ? car.title.split(' ')[0] : ''),
        model: car.model || '',
        year: car.year || 2024,
        category: car.category || 'Sports',
        priceAmount: car.priceAmount || car.price || '',
        location: car.location || '',
        description: car.description || '',
        imageUrl: car.imageUrl || car.image || '',
        horsepower: car.horsepower || car.hp || '450',
        topSpeed: car.topSpeed || '180 mph',
        acceleration: car.acceleration || '3.5s',
        transmission: car.transmission || 'Automatic',
        drivetrain: car.drivetrain || 'AWD',
        fuelType: car.fuelType || 'Gasoline',
        status: car.status || 'available',
        isFeatured: Boolean(car.isFeatured)
      });
    }
  }, [car]);

  if (!isOpen || !car) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericPrice = Number(formData.priceAmount) || 0;
    const formattedPrice = `$${numericPrice.toLocaleString()}`;

    const updated = {
      ...formData,
      price: formattedPrice,
      priceAmount: numericPrice
    };

    if (typeof onSave === 'function') {
      onSave(car.id, updated);
    } else if (typeof updateCar === 'function') {
      updateCar(car.id, updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Vehicle Editor
            </span>
            <h2 className="text-lg font-bold">Edit {car.title || 'Vehicle'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              darkMode
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Identity & Price */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">Vehicle Name / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Price (USD) *</label>
                <input
                  type="number"
                  required
                  value={formData.priceAmount}
                  onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Showroom Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Performance & Mechanics */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Performance Specifications
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium mb-1">Horsepower</label>
                <input
                  type="text"
                  value={formData.horsepower}
                  onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Top Speed</label>
                <input
                  type="text"
                  value={formData.topSpeed}
                  onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">0-60 Time</label>
                <input
                  type="text"
                  value={formData.acceleration}
                  onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium mb-1">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Drivetrain</label>
                <select
                  value={formData.drivetrain}
                  onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  {DRIVETRAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className={`w-full rounded-xl p-2.5 border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image & Description */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Media & Imagery
            </h3>
            <div>
              <label className="block font-medium mb-1">Vehicle Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className={`w-full rounded-xl p-2.5 border transition-all ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
              {formData.imageUrl && (
                <div className="mt-2.5">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-700 bg-slate-950"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Showroom Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full rounded-xl p-2.5 border transition-all ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Status & Featured */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <label className="font-medium">Inventory Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`rounded-xl px-3 py-1.5 border capitalize text-xs ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
