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
    images: [],
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
      const existingImages = Array.isArray(car.images) && car.images.length > 0
        ? car.images
        : (car.imageUrl || car.image ? [car.imageUrl || car.image] : []);

      setFormData({
        title: car.title || car.name || '',
        brand: car.brand || (car.title ? car.title.split(' ')[0] : ''),
        model: car.model || '',
        year: car.year || 2024,
        category: car.category || 'Sports',
        priceAmount: car.priceAmount || car.price || '',
        location: car.location || '',
        description: car.description || '',
        imageUrl: car.imageUrl || car.image || (existingImages[0] || ''),
        images: existingImages,
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

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          setFormData((prev) => {
            const currentImages = Array.isArray(prev.images) ? [...prev.images] : [];
            const updated = [...currentImages, dataUrl];
            return {
              ...prev,
              images: updated,
              imageUrl: prev.imageUrl || dataUrl
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        imageUrl: updated.length > 0 ? (prev.imageUrl === prev.images[index] ? updated[0] : prev.imageUrl) : ''
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericPrice = Number(formData.priceAmount) || 0;
    const formattedPrice = `$${numericPrice.toLocaleString()}`;

    const primaryImage = formData.imageUrl?.trim() || formData.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80';
    const allImages = formData.images && formData.images.length > 0 ? formData.images : [primaryImage];

    const updated = {
      ...formData,
      image: primaryImage,
      imageUrl: primaryImage,
      images: allImages,
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
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Vehicle Editor
            </span>
            <h2 className="text-xl font-bold">Edit {car.title || 'Vehicle'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Identity & Price */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Vehicle Name / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Price (USD) *</label>
                <input
                  type="number"
                  required
                  value={formData.priceAmount}
                  onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
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
                <label className="block text-sm font-semibold mb-1.5">Showroom Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Performance & Mechanics */}
          <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Performance Specifications
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Horsepower</label>
                <input
                  type="text"
                  value={formData.horsepower}
                  onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Top Speed</label>
                <input
                  type="text"
                  value={formData.topSpeed}
                  onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">0-60 Time</label>
                <input
                  type="text"
                  value={formData.acceleration}
                  onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
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
                <label className="block text-sm font-semibold mb-1.5">Drivetrain</label>
                <select
                  value={formData.drivetrain}
                  onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
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
                <label className="block text-sm font-semibold mb-1.5">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className={`w-full rounded-xl p-3 text-sm border transition-all ${
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
          <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Media & Imagery
            </h3>
            <div className="space-y-4">
              {/* Multiple Files Upload Option */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Upload Photos (Select Multiple)</label>
                <label className={`flex flex-col items-center justify-center gap-2 w-full p-5 rounded-xl border border-dashed cursor-pointer transition-colors ${
                  darkMode
                    ? 'border-slate-700 bg-slate-950/60 hover:border-emerald-500 text-slate-200'
                    : 'border-slate-300 bg-slate-50 hover:border-emerald-500 text-slate-800'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-sm font-bold text-emerald-400">Choose multiple photos from device...</span>
                  </div>
                  <span className="text-xs text-slate-400">Select multiple angles, exterior, and interior photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleFiles}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Primary Image Preview */}
              {formData.imageUrl && (
                <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-950/85 text-white border border-white/20">
                    Primary Cover Photo
                  </span>
                </div>
              )}

              {/* Gallery of Uploaded Photos */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>
                      Vehicle Gallery ({formData.images.length} photo{formData.images.length > 1 ? 's' : ''})
                    </span>
                    <span className="text-xs text-slate-400">Click photo to set as cover</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {formData.images.map((imgSrc, idx) => {
                      const isPrimary = formData.imageUrl === imgSrc;
                      return (
                        <div
                          key={idx}
                          className={`group relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            isPrimary ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-700/60 hover:border-slate-500'
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, imageUrl: imgSrc }))}
                        >
                          <img src={imgSrc} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                            title="Delete photo"
                          >
                            ✕
                          </button>
                          {isPrimary && (
                            <span className="absolute bottom-0 inset-x-0 bg-emerald-500 text-slate-950 text-xs font-bold text-center py-0.5">
                              Cover
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Showroom Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full rounded-xl p-3 text-sm border transition-all ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold">Inventory Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`rounded-xl px-3.5 py-2 border capitalize text-sm font-medium ${
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
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
