import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Sports', 'Electric', 'SUV', 'Luxury', 'Supercar'];
const TRANSMISSIONS = ['Automatic', 'PDK Dual-Clutch', 'Manual'];
const DRIVETRAINS = ['AWD', 'RWD', 'FWD'];
const FUEL_TYPES = ['Gasoline', 'Electric', 'Hybrid'];
const STATUSES = ['available', 'reserved', 'sold'];

export default function AdminInventoryPage() {
  const navigate = useNavigate();
  const { cars, addCar, updateCar, deleteCar, toggleCarStatus, setToast } = useCarContext();
  const { isAdmin, switchRole, user } = useAuth();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // Form State
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
    isFeatured: false,
    keyFeaturesStr: '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  // Handle Edit click
  const handleOpenEdit = (car) => {
    setEditingCar(car);
    const existingImages = Array.isArray(car.images) && car.images.length > 0
      ? car.images
      : (car.imageUrl || car.image)
      ? [car.imageUrl || car.image]
      : [];

    setFormData({
      title: car.title || car.name || '',
      brand: car.brand || (car.title ? car.title.split(' ')[0] : ''),
      model: car.model || '',
      year: car.year || 2024,
      category: car.category || 'Sports',
      priceAmount: car.priceAmount || car.price || '',
      location: car.location || '',
      description: car.description || '',
      imageUrl: car.imageUrl || car.image || existingImages[0] || '',
      images: existingImages,
      horsepower: car.horsepower || car.hp || '450',
      topSpeed: car.topSpeed || '180 mph',
      acceleration: car.acceleration || '3.5s',
      transmission: car.transmission || 'Automatic',
      drivetrain: car.drivetrain || 'AWD',
      fuelType: car.fuelType || 'Gasoline',
      status: car.status || 'available',
      isFeatured: Boolean(car.isFeatured),
      keyFeaturesStr: Array.isArray(car.keyFeatures) ? car.keyFeatures.join(', ') : '',
    });
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingCar(null);
    setFormData({
      title: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      category: 'Sports',
      priceAmount: '',
      location: 'Los Angeles, CA',
      description: '',
      imageUrl: '',
      images: [],
      horsepower: '450',
      topSpeed: '185 mph',
      acceleration: '3.6s',
      transmission: 'Automatic',
      drivetrain: 'AWD',
      fuelType: 'Gasoline',
      status: 'available',
      isFeatured: false,
      keyFeaturesStr: 'Sport Chrono Package, Leather Interior, Adaptive Suspension',
    });
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => {
      const updatedImages = [...prev.images, newImageUrl.trim()];
      return {
        ...prev,
        images: updatedImages,
        imageUrl: prev.imageUrl || updatedImages[0]
      };
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updatedImages,
        imageUrl: updatedImages[0] || ''
      };
    });
  };

  const handleSetPrimaryImage = (indexToPrimary) => {
    setFormData((prev) => {
      const targetImage = prev.images[indexToPrimary];
      const otherImages = prev.images.filter((_, idx) => idx !== indexToPrimary);
      const reorderedImages = [targetImage, ...otherImages];
      return {
        ...prev,
        images: reorderedImages,
        imageUrl: targetImage
      };
    });
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedUrl = reader.result;
        setFormData((prev) => {
          const updatedImages = [...prev.images, uploadedUrl];
          return {
            ...prev,
            images: updatedImages,
            imageUrl: prev.imageUrl || updatedImages[0]
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.priceAmount) {
      setToast('Please provide a vehicle title and price');
      return;
    }

    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Number(formData.priceAmount));

    const finalImages = formData.images.length > 0
      ? formData.images
      : formData.imageUrl
      ? [formData.imageUrl]
      : [];

    const carPayload = {
      ...formData,
      priceAmount: Number(formData.priceAmount),
      price: formattedPrice,
      imageUrl: finalImages[0] || formData.imageUrl || '',
      images: finalImages,
      fuel: formData.fuelType,
      fuelType: formData.fuelType,
      rating: 4.9,
      keyFeatures: formData.keyFeaturesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingCar) {
      updateCar(editingCar.id, carPayload);
    } else {
      addCar(carPayload);
    }

    setIsModalOpen(false);
  };

  // Filter cars for admin list
  const filteredAdminCars = cars.filter((car) => {
    const matchesCategory = categoryFilter === 'All' || car.category === categoryFilter;
    const matchesSearch = `${car.title || ''} ${car.location || ''}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="admin-portal space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Admin Portal
            </span>
            <h1 className="text-xl font-bold text-slate-100">Vehicle Inventory Manager</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage showroom luxury listings, specs, availability, and multimedia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => switchRole('customer')}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
          >
            Switch to Client View
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Vehicle
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Total Showroom Cars</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">{cars.length} Vehicles</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Active Fleet Value</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ${(cars.reduce((sum, c) => sum + (c.priceAmount || 0), 0) / 1000000).toFixed(2)}M
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Featured Vehicles</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {cars.filter((c) => c.isFeatured).length} Featured
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <input
          type="text"
          placeholder="Search by vehicle name, model, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table / Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredAdminCars.map((car) => (
                <tr key={car.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={car.imageUrl || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300'}
                      alt={car.title}
                      className="w-12 h-9 object-cover rounded-md border border-slate-700 bg-slate-950"
                    />
                    <div>
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        {car.title}
                        {car.isFeatured && (
                          <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{car.location || 'Showroom'}</div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                      {car.category || 'Luxury'}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-400">{car.price}</td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        toggleCarStatus(
                          car.id,
                          car.status === 'available' ? 'reserved' : car.status === 'reserved' ? 'sold' : 'available'
                        )
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border capitalize transition-all ${
                        car.status === 'sold'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : car.status === 'reserved'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {car.status || 'available'}
                    </button>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(car)}
                      className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCar(car.id)}
                      className="px-2.5 py-1 text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 rounded transition border border-rose-900/40"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form for Add / Edit Vehicle */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h2 className="text-base font-bold text-slate-100">
                {editingCar ? 'Edit Vehicle Details' : 'Add New Showroom Vehicle'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Title / Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Porsche 911 GT3 RS"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Price (USD Amount) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 241300"
                    value={formData.priceAmount}
                    onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Los Angeles, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Specs & Performance */}
              <div className="border-t border-slate-800/80 pt-3 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Horsepower</label>
                  <input
                    type="text"
                    placeholder="518 hp"
                    value={formData.horsepower}
                    onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Top Speed</label>
                  <input
                    type="text"
                    placeholder="184 mph"
                    value={formData.topSpeed}
                    onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">0-60 Time</label>
                  <input
                    type="text"
                    placeholder="3.0s"
                    value={formData.acceleration}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              {/* Multi-Image Input Section */}
              <div className="border-t border-slate-800/80 pt-3 space-y-2">
                <label className="block text-slate-400">Vehicle Photos Gallery (Multiple Images Support)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter photo URL (https://images.unsplash.com/...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3.5 py-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg font-semibold border border-emerald-500/30 text-xs"
                  >
                    + Add Image
                  </button>
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer border border-slate-700 flex items-center gap-1 font-semibold text-xs">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFileUpload} />
                  </label>
                </div>

                {/* Thumbnails Gallery List */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] text-slate-400">
                      {formData.images.length} photo{formData.images.length > 1 ? 's' : ''} attached (First photo is set as primary thumbnail):
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-[1.3]">
                          <img src={imgUrl} alt={`Car photo ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                            {idx === 0 ? (
                              <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                                ★ Primary
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-[10px] bg-rose-500/80 hover:bg-rose-600 text-white px-1.5 py-0.5 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    No images added yet. Add photo URLs or click Upload to build a gallery.
                  </p>
                )}
              </div>

              {/* Description & Features */}
              <div className="border-t border-slate-800/80 pt-3 space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a luxury description of the car..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Key Feature Highlights (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Carbon Ceramic Brakes, Front Axle Lift, PASM Suspension"
                    value={formData.keyFeaturesStr}
                    onChange={(e) => setFormData({ ...formData, keyFeaturesStr: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="isFeatured" className="text-slate-300">
                  Highlight as Featured Vehicle on Showroom Home
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-300 shadow-lg shadow-emerald-500/20"
                >
                  {editingCar ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
