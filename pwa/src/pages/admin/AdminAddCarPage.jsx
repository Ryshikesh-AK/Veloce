import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';

const INITIAL_FORM = {
  name: '',
  brand: '',
  category: 'Supercar',
  year: new Date().getFullYear(),
  pricePerDay: '',
  originalPrice: '',
  image: '',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  seats: 2,
  description: '',
  specs: {
    horsepower: '',
    acceleration: '',
    topSpeed: '',
  },
  features: '',
  isAvailable: true,
  isFeatured: false,
};

const CATEGORIES = ['Supercar', 'Hypercar', 'Luxury Sedan', 'Sports Car', 'Luxury SUV', 'Classic'];

export default function AdminAddCarPage() {
  const navigate = useNavigate();
  const { addCar, darkMode, setToast } = useCarContext();
  const [form, setForm] = useState(INITIAL_FORM);
  const [previewError, setPreviewError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('spec_')) {
      const specField = name.replace('spec_', '');
      setForm((prev) => ({
        ...prev,
        specs: { ...prev.specs, [specField]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.pricePerDay) {
      if (setToast) {
        setToast({
          id: Date.now(),
          message: 'Vehicle model and daily rate are required.',
          type: 'error',
        });
      }
      return;
    }

    const payload = {
      ...form,
      id: `car-${Date.now()}`,
      pricePerDay: Number(form.pricePerDay),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      year: Number(form.year) || new Date().getFullYear(),
      seats: Number(form.seats) || 2,
      image: form.image?.trim() || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      features: typeof form.features === 'string'
        ? form.features.split(',').map((f) => f.trim()).filter(Boolean)
        : form.features,
    };

    addCar(payload);

    if (setToast) {
      setToast({
        id: Date.now(),
        message: `${payload.name} added to fleet inventory!`,
        type: 'success',
      });
    }

    navigate('/admin/inventory');
  };

  return (
    <div
      className={`min-h-screen pb-28 pt-4 transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AdminNavTabs
          title="Add New Vehicle"
          subtitle="Expand your luxury fleet by registering a new high-performance automobile."
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Form Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Information */}
              <div
                className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                  darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
                }`}
              >
                <h3 className="mb-4 text-base font-semibold">General Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Vehicle Name / Model *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Porsche 911 GT3 RS"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Brand / Manufacturer
                    </label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="e.g. Porsche"
                      value={form.brand}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
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
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Model Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      min="1990"
                      max="2030"
                      value={form.year}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Passenger Seats
                    </label>
                    <input
                      type="number"
                      name="seats"
                      min="1"
                      max="9"
                      value={form.seats}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Detailed Overview / Story
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Highlight what makes driving this automobile an unparalleled luxury experience..."
                      value={form.description}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Performance Specs */}
              <div
                className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                  darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
                }`}
              >
                <h3 className="mb-4 text-base font-semibold">Pricing & Performance</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Rate Per Day ($ USD) *
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      placeholder="e.g. 1450"
                      value={form.pricePerDay}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Original / Strike Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      placeholder="e.g. 1750 (optional)"
                      value={form.originalPrice}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Horsepower
                    </label>
                    <input
                      type="text"
                      name="spec_horsepower"
                      placeholder="e.g. 518 HP"
                      value={form.specs.horsepower}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      0-60 Acceleration
                    </label>
                    <input
                      type="text"
                      name="spec_acceleration"
                      placeholder="e.g. 3.0s"
                      value={form.specs.acceleration}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Features (Comma-separated)
                    </label>
                    <input
                      type="text"
                      name="features"
                      placeholder="Carbon Ceramic Brakes, Track Telemetry, Burmester Sound, Sport Chrono"
                      value={form.features}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Media Preview & Toggles */}
            <div className="space-y-6">
              {/* Photo Card */}
              <div
                className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                  darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
                }`}
              >
                <h3 className="mb-3 text-base font-semibold">Vehicle Imagery</h3>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    High-Res Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    placeholder="https://images.unsplash.com/..."
                    value={form.image}
                    onChange={(e) => {
                      setPreviewError(false);
                      handleChange(e);
                    }}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 ${
                      darkMode
                        ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                    }`}
                  />
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                  {form.image && !previewError ? (
                    <img
                      src={form.image}
                      alt="Car Preview"
                      onError={() => setPreviewError(true)}
                      className="h-full w-full object-cover transition-all"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center text-xs text-slate-400">
                      <svg className="mb-2 h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {previewError ? 'Image failed to load. Check URL.' : 'Preview will display here'}
                    </div>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div
                className={`space-y-4 rounded-2xl border p-5 shadow-sm transition-colors ${
                  darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
                }`}
              >
                <h3 className="text-base font-semibold">Settings</h3>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Available for Booking</span>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#b9f43d]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Featured in Showcase</span>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#b9f43d]"
                  />
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#b9f43d] py-3 text-sm font-bold text-slate-950 shadow-sm transition-all hover:bg-[#a8e630] hover:shadow-md"
                >
                  Save & Publish Vehicle
                </button>
                <Link
                  to="/admin/inventory"
                  className={`block w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-all ${
                    darkMode
                      ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Discard / Return
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
