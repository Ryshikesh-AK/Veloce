import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Car as CarIcon, 
  ChevronRight, 
  Search, 
  X, 
  Check, 
  Sparkles, 
  Flame,
  Award,
  Shield,
  Gauge,
  Fuel,
  Zap,
  ArrowLeftRight,
  Share2,
  CheckCircle2,
  Plus,
  Trash2,
  Eye,
  Minimize2,
  Maximize2,
  Calculator
} from 'lucide-react';
import { useCarContext } from '../context/CarContext';
import { hapticAction, hapticTab } from '../utils/haptics';
import CarPhoto from '../components/cars/CarPhoto';
import LeaseCalculatorModal from '../components/cars/LeaseCalculatorModal';

export default function ComparePage() {
  const navigate = useNavigate();
  const { cars, darkMode, compareIds, setCompareIds, setToast } = useCarContext();

  // Selected car slots for comparison (Supports 2 or 3 vehicles)
  const [carSlot1, setCarSlot1] = useState(() => {
    if (compareIds.length > 0) return cars.find((c) => c.id === compareIds[0]) || cars[0] || null;
    return cars[0] || null;
  });

  const [carSlot2, setCarSlot2] = useState(() => {
    if (compareIds.length > 1) return cars.find((c) => c.id === compareIds[1]) || cars[1] || null;
    return cars[1] || cars[0] || null;
  });

  const [carSlot3, setCarSlot3] = useState(() => {
    if (compareIds.length > 2) return cars.find((c) => c.id === compareIds[2]) || null;
    return null;
  });

  // State: 'builder' (VS Selection Screen) or 'matrix' (Head-to-head spec comparison)
  const [viewState, setViewState] = useState('builder');

  // Active matrix category: 'all' | 'performance' | 'pricing' | 'specs' | 'features'
  const [activeCategory, setActiveCategory] = useState('all');

  // View preferences: compact mode & differences only toggle
  const [isCompact, setIsCompact] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);

  // Modal selector for picking car into slot 1, 2, or 3
  const [activePickerSlot, setActivePickerSlot] = useState(null); // null | 1 | 2 | 3
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('all');

  // Lease Calculator Modal State
  const [leaseModalCar, setLeaseModalCar] = useState(null);

  // Sync compareIds in CarContext when slots change
  useEffect(() => {
    const activeIds = [carSlot1?.id, carSlot2?.id, carSlot3?.id].filter(Boolean);
    if (setCompareIds) {
      setCompareIds(activeIds);
    }
  }, [carSlot1?.id, carSlot2?.id, carSlot3?.id, setCompareIds]);

  const openPicker = (slotNumber) => {
    hapticTab();
    setActivePickerSlot(slotNumber);
    setPickerSearch('');
    setPickerCategory('all');
  };

  const handleSelectCarForSlot = (selectedCar) => {
    hapticAction();
    if (activePickerSlot === 1) {
      setCarSlot1(selectedCar);
    } else if (activePickerSlot === 2) {
      setCarSlot2(selectedCar);
    } else if (activePickerSlot === 3) {
      setCarSlot3(selectedCar);
    }
    setActivePickerSlot(null);
  };

  const handleRemoveSlot3 = (e) => {
    e?.stopPropagation();
    hapticAction();
    setCarSlot3(null);
    setToast?.('Removed vehicle 3 from comparison');
  };

  const handleSwapSlots = () => {
    hapticAction();
    const temp = carSlot1;
    setCarSlot1(carSlot2);
    setCarSlot2(temp);
    setToast?.('Swapped vehicle positions');
  };

  const handleStartCompare = () => {
    if (!carSlot1 || !carSlot2) return;
    hapticAction();
    setViewState('matrix');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareComparison = () => {
    hapticAction();
    const titles = [carSlot1?.title, carSlot2?.title, carSlot3?.title].filter(Boolean).join(' vs ');
    const shareText = `Check out this luxury vehicle comparison: ${titles} on DriveXCars! ${window.location.href}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setToast?.('Comparison link copied to clipboard!');
    } else {
      setToast?.('Comparison ready: ' + titles);
    }
  };

  // Quick Preset Duel Matchups
  const quickMatchups = useMemo(() => {
    if (!cars || cars.length < 2) return [];
    return [
      {
        title: 'Super EV vs Iconic 911',
        car1: cars.find(c => c.id.includes('audi') || c.category === 'Electric') || cars[0],
        car2: cars.find(c => c.id.includes('porsche') || c.title?.includes('911')) || cars[1]
      },
      {
        title: 'Track Performance Duel',
        car1: cars.find(c => c.horsepower && parseInt(c.horsepower) > 600) || cars[0],
        car2: cars.find(c => c.acceleration && parseFloat(c.acceleration) < 3.5 && c.id !== cars[0]?.id) || cars[1]
      },
      {
        title: 'Flagship Luxury Showdown',
        car1: cars[0],
        car2: cars[cars.length - 1] || cars[1]
      }
    ].filter(m => m.car1 && m.car2 && m.car1.id !== m.car2.id);
  }, [cars]);

  const selectQuickMatchup = (m) => {
    hapticAction();
    setCarSlot1(m.car1);
    setCarSlot2(m.car2);
    setCarSlot3(null);
    setToast?.(`Loaded ${m.car1.brand} vs ${m.car2.brand}`);
  };

  // Filter cars in Picker Drawer
  const pickerCategories = ['all', 'Electric', 'Sports', 'Luxury', 'SUV', 'Sedan'];
  const filteredPickerCars = cars.filter((c) => {
    const q = pickerSearch.toLowerCase().trim();
    const matchesSearch = !q || (
      c.title?.toLowerCase().includes(q) ||
      c.brand?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
    const matchesCat = pickerCategory === 'all' || c.category?.toLowerCase() === pickerCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Numeric parsers for smart advantages
  const parseNum = (val) => {
    if (!val) return null;
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : num;
  };

  const getMonthlyLease = (car) => {
    if (!car) return 'N/A';
    const priceNum = parseNum(car.price) || 120000;
    return `$${Math.round(priceNum * 0.011).toLocaleString()}/mo`;
  };

  // Active slots array
  const activeSlots = useMemo(() => {
    return [
      { slot: 1, car: carSlot1 },
      { slot: 2, car: carSlot2 },
      ...(carSlot3 ? [{ slot: 3, car: carSlot3 }] : [])
    ];
  }, [carSlot1, carSlot2, carSlot3]);

  // SPEC COMPARISONS DEFINITION (Structured by Categories)
  const allComparisonRows = useMemo(() => {
    const c1 = carSlot1;
    const c2 = carSlot2;
    const c3 = carSlot3;

    return [
      // 1. Performance & Powertrain
      {
        category: 'performance',
        label: '0–60 mph Acceleration',
        shortLabel: '0-60 mph',
        unit: 's',
        type: 'lower-wins',
        icon: Zap,
        val1: c1?.acceleration || '3.5s',
        val2: c2?.acceleration || '3.8s',
        val3: c3 ? (c3.acceleration || '3.6s') : null,
        num1: parseNum(c1?.acceleration || '3.5'),
        num2: parseNum(c2?.acceleration || '3.8'),
        num3: c3 ? parseNum(c3.acceleration || '3.6') : null,
      },
      {
        category: 'performance',
        label: 'Horsepower / Output',
        shortLabel: 'Power',
        unit: 'hp',
        type: 'higher-wins',
        icon: Flame,
        val1: c1?.horsepower ? `${c1.horsepower}` : 'High Output',
        val2: c2?.horsepower ? `${c2.horsepower}` : 'High Output',
        val3: c3 ? (c3.horsepower ? `${c3.horsepower}` : 'High Output') : null,
        num1: parseNum(c1?.horsepower),
        num2: parseNum(c2?.horsepower),
        num3: c3 ? parseNum(c3.horsepower) : null,
      },
      {
        category: 'performance',
        label: 'Top Speed',
        shortLabel: 'Top Speed',
        unit: 'mph',
        type: 'higher-wins',
        icon: Gauge,
        val1: c1?.topSpeed || '155 mph',
        val2: c2?.topSpeed || '155 mph',
        val3: c3 ? (c3.topSpeed || '155 mph') : null,
        num1: parseNum(c1?.topSpeed),
        num2: parseNum(c2?.topSpeed),
        num3: c3 ? parseNum(c3.topSpeed) : null,
      },
      {
        category: 'performance',
        label: 'Drivetrain',
        shortLabel: 'Drivetrain',
        icon: Gauge,
        val1: c1?.drivetrain || 'All-Wheel Drive (AWD)',
        val2: c2?.drivetrain || 'All-Wheel Drive (AWD)',
        val3: c3 ? (c3.drivetrain || 'All-Wheel Drive (AWD)') : null,
      },
      {
        category: 'performance',
        label: 'Transmission',
        shortLabel: 'Transmission',
        icon: Gauge,
        val1: c1?.transmission || 'Automatic',
        val2: c2?.transmission || 'Automatic',
        val3: c3 ? (c3.transmission || 'Automatic') : null,
      },

      // 2. Pricing & Lease
      {
        category: 'pricing',
        label: 'Price (MSRP)',
        shortLabel: 'MSRP',
        type: 'lower-wins',
        icon: Award,
        val1: c1?.price || 'N/A',
        val2: c2?.price || 'N/A',
        val3: c3 ? (c3.price || 'N/A') : null,
        num1: parseNum(c1?.price),
        num2: parseNum(c2?.price),
        num3: c3 ? parseNum(c3.price) : null,
      },
      {
        category: 'pricing',
        label: 'Est. Monthly Lease',
        shortLabel: 'Est. Lease',
        type: 'lower-wins',
        icon: Calculator,
        val1: getMonthlyLease(c1),
        val2: getMonthlyLease(c2),
        val3: c3 ? getMonthlyLease(c3) : null,
        num1: parseNum(getMonthlyLease(c1)),
        num2: parseNum(getMonthlyLease(c2)),
        num3: c3 ? parseNum(getMonthlyLease(c3)) : null,
      },
      {
        category: 'pricing',
        label: 'Fuel / Energy Type',
        shortLabel: 'Energy',
        icon: Fuel,
        val1: c1?.fuel || c1?.fuelType || 'Petrol',
        val2: c2?.fuel || c2?.fuelType || 'Petrol',
        val3: c3 ? (c3.fuel || c3.fuelType || 'Petrol') : null,
      },
      {
        category: 'pricing',
        label: 'Showroom Location',
        shortLabel: 'Location',
        icon: Award,
        val1: c1?.location || 'Flagship Showroom',
        val2: c2?.location || 'Flagship Showroom',
        val3: c3 ? (c3.location || 'Flagship Showroom') : null,
      },

      // 3. Specifications & Dimensions
      {
        category: 'specs',
        label: 'Model Year',
        shortLabel: 'Year',
        icon: Gauge,
        val1: c1?.year ? `${c1.year}` : '2024',
        val2: c2?.year ? `${c2.year}` : '2024',
        val3: c3 ? (c3.year ? `${c3.year}` : '2024') : null,
      },
      {
        category: 'specs',
        label: 'Body Classification',
        shortLabel: 'Body Class',
        icon: CarIcon,
        val1: c1?.category || 'Luxury',
        val2: c2?.category || 'Luxury',
        val3: c3 ? (c3.category || 'Luxury') : null,
      },
      {
        category: 'specs',
        label: 'Mileage / Odometer',
        shortLabel: 'Mileage',
        type: 'lower-wins',
        icon: Gauge,
        val1: c1?.mileageFormatted || (c1?.mileage ? `${Number(c1.mileage).toLocaleString()} mi` : 'Delivery Miles'),
        val2: c2?.mileageFormatted || (c2?.mileage ? `${Number(c2.mileage).toLocaleString()} mi` : 'Delivery Miles'),
        val3: c3 ? (c3.mileageFormatted || (c3.mileage ? `${Number(c3.mileage).toLocaleString()} mi` : 'Delivery Miles')) : null,
        num1: parseNum(c1?.mileage),
        num2: parseNum(c2?.mileage),
        num3: c3 ? parseNum(c3.mileage) : null,
      },

      // 4. Luxury, Tech & Features
      {
        category: 'features',
        label: 'Premium Audio System',
        shortLabel: 'Audio',
        icon: Sparkles,
        val1: c1?.category === 'Electric' ? 'Bang & Olufsen 3D' : 'Burmester High-End Surround',
        val2: c2?.category === 'Electric' ? 'Bang & Olufsen 3D' : 'Meridian Signature Sound',
        val3: c3 ? (c3.category === 'Electric' ? 'Bowers & Wilkins 3D' : 'Harman Kardon Logic7') : null,
      },
      {
        category: 'features',
        label: 'Suspension System',
        shortLabel: 'Suspension',
        icon: Shield,
        val1: 'Adaptive Air Suspension w/ Dynamic Ride',
        val2: 'Adaptive Sport Suspension w/ Terrain Response',
        val3: c3 ? 'Multichamber Active Dampers' : null,
      },
      {
        category: 'features',
        label: 'Panoramic Glass Roof',
        shortLabel: 'Sunroof',
        icon: Sparkles,
        val1: 'Electrochromic Smart Glass',
        val2: 'Full Sliding Panoramic Roof',
        val3: c3 ? 'Fixed Thermal Acoustic Glass' : null,
      },
      {
        category: 'features',
        label: 'Driver Assist Package',
        shortLabel: 'Driver Assist',
        icon: Shield,
        val1: 'Level 2+ Highway Pilot & 360° Cam',
        val2: 'Surround 3D Camera, Radar & Lidar',
        val3: c3 ? 'Pilot Assist & Collision Mitigation' : null,
      },
      {
        category: 'features',
        label: 'Factory Warranty Coverage',
        shortLabel: 'Warranty',
        icon: Shield,
        val1: '4 Yr / 50k Mi Factory Warranty',
        val2: '4 Yr / 50k Mi Factory Warranty',
        val3: c3 ? '4 Yr / 50k Mi Factory Warranty' : null,
      }
    ];
  }, [carSlot1, carSlot2, carSlot3]);

  // Filter rows based on active category & diffOnly toggle
  const displayedRows = useMemo(() => {
    return allComparisonRows.filter((row) => {
      // Category filter
      if (activeCategory !== 'all' && row.category !== activeCategory) {
        return false;
      }
      // Difference filter
      if (diffOnly) {
        const isDiff = row.val3 !== null
          ? (row.val1 !== row.val2 || row.val2 !== row.val3 || row.val1 !== row.val3)
          : (row.val1 !== row.val2);
        if (!isDiff) return false;
      }
      return true;
    });
  }, [allComparisonRows, activeCategory, diffOnly]);

  // Compute winner badge for a specific cell
  const getAdvantageBadge = (row, slotIndex) => {
    if (!row.type) return null;
    const nums = [row.num1, row.num2, row.num3].filter((n) => n !== null && n !== undefined);
    if (nums.length < 2) return null;

    const currentNum = slotIndex === 1 ? row.num1 : slotIndex === 2 ? row.num2 : row.num3;
    if (currentNum === null || currentNum === undefined) return null;

    if (row.type === 'lower-wins') {
      const minVal = Math.min(...nums);
      if (currentNum === minVal && nums.filter(n => n === minVal).length === 1) {
        if (row.label.includes('Acceleration')) return '⚡ Faster';
        if (row.label.includes('Price')) return '💎 Best Value';
        if (row.label.includes('Lease')) return '🏷️ Lower Mo.';
        if (row.label.includes('Mileage')) return '✨ Lower Miles';
        return '✓ Advantage';
      }
    } else if (row.type === 'higher-wins') {
      const maxVal = Math.max(...nums);
      if (currentNum === maxVal && nums.filter(n => n === maxVal).length === 1) {
        if (row.label.includes('Horsepower')) return '🏆 More Power';
        if (row.label.includes('Speed')) return '🔥 Top Speed';
        return '✓ Advantage';
      }
    }
    return null;
  };

  // Diff count across all specs
  const diffCount = useMemo(() => {
    return allComparisonRows.filter((row) => {
      return row.val3 !== null
        ? (row.val1 !== row.val2 || row.val2 !== row.val3 || row.val1 !== row.val3)
        : (row.val1 !== row.val2);
    }).length;
  }, [allComparisonRows]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-36 space-y-6" data-purpose="compare-screen">
      
      {/* ======================================================== */}
      {/* SCREEN 1: VS MATCHUP BUILDER (Showdown Arena)             */}
      {/* ======================================================== */}
      {viewState === 'builder' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                VEHICLE SHOWDOWN
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Compare Luxury Vehicles
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Select 2 or 3 vehicles side by side to analyze performance specs, lease estimates, and handcrafted luxury options.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleSwapSlots}
                disabled={!carSlot1 || !carSlot2}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                title="Swap vehicle 1 and 2"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
              
              {!carSlot3 ? (
                <button
                  type="button"
                  onClick={() => openPicker(3)}
                  className="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add 3rd Car</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveSlot3}
                  className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove 3rd</span>
                </button>
              )}
            </div>
          </div>

          {/* VS Card Selection Frame (Responsive: 2-3 columns on desktop, clean cards on mobile) */}
          <div className="relative">
            <div className={`grid grid-cols-1 ${carSlot3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 sm:gap-6`}>
              
              {/* Slot 1: First Car */}
              <div 
                className={`relative rounded-3xl border-2 transition-all flex flex-col justify-between overflow-hidden group ${
                  carSlot1
                    ? 'border-emerald-500/40 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none'
                    : 'border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Slot Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      Vehicle 1
                    </span>
                    <button
                      type="button"
                      onClick={() => openPicker(1)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{carSlot1 ? 'Change Car' : 'Choose Car'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {carSlot1 ? (
                    <>
                      {/* Car Visual Spotlight */}
                      <div 
                        onClick={() => openPicker(1)}
                        className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 relative border border-black/10 dark:border-white/10 cursor-pointer group-hover:border-emerald-500/50 transition"
                      >
                        <CarPhoto 
                          src={carSlot1.imageUrl || carSlot1.image} 
                          alt={carSlot1.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                          {carSlot1.category || 'Luxury'}
                        </div>
                      </div>

                      {/* Info & Specs */}
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{carSlot1.brand}</p>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                          {carSlot1.title}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                            {carSlot1.price}
                          </p>
                          <span className="text-xs text-slate-400 font-medium">
                            {getMonthlyLease(carSlot1)}
                          </span>
                        </div>
                      </div>

                      {/* Mini Spec Badges */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-white/5 text-[11px] font-semibold">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                          <div className="text-[9px] text-slate-400 uppercase">0–60 mph</div>
                          <div className="text-slate-800 dark:text-slate-200 mt-0.5">{carSlot1.acceleration || '3.5s'}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                          <div className="text-[9px] text-slate-400 uppercase">Power</div>
                          <div className="text-slate-800 dark:text-slate-200 mt-0.5">{carSlot1.horsepower || 'High Output'}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                          <div className="text-[9px] text-slate-400 uppercase">Energy</div>
                          <div className="text-slate-800 dark:text-slate-200 mt-0.5 truncate">{carSlot1.fuel || 'Petrol'}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div 
                      onClick={() => openPicker(1)}
                      className="py-12 flex flex-col items-center justify-center text-center cursor-pointer space-y-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <CarIcon className="w-8 h-8" />
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Select Vehicle 1</div>
                      <p className="text-xs text-slate-400">Tap to browse luxury inventory</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Slot 2: Second Car */}
              <div 
                className={`relative rounded-3xl border-2 transition-all flex flex-col justify-between overflow-hidden group ${
                  carSlot2
                    ? 'border-rose-500/40 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none'
                    : 'border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Slot Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full">
                      Vehicle 2
                    </span>
                    <button
                      type="button"
                      onClick={() => openPicker(2)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{carSlot2 ? 'Change Car' : 'Choose Car'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {carSlot2 ? (
                    <>
                      {/* Car Visual Spotlight */}
                      <div 
                        onClick={() => openPicker(2)}
                        className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 relative border border-black/10 dark:border-white/10 cursor-pointer group-hover:border-rose-500/50 transition"
                      >
                        <CarPhoto 
                          src={carSlot2.imageUrl || carSlot2.image} 
                          alt={carSlot2.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                          {carSlot2.category || 'Luxury'}
                        </div>
                      </div>

                      {/* Info & Specs */}
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{carSlot2.brand}</p>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                          {carSlot2.title}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400">
                            {carSlot2.price}
                          </p>
                          <span className="text-xs text-slate-400 font-medium">
                            {getMonthlyLease(carSlot2)}
                          </span>
                        </div>
                      </div>

                      {/* Mini Spec Badges */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-white/5 text-[11px] font-semibold">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                          <div className="text-[9px] text-slate-400 uppercase">0–60 mph</div>
                          <div className="text-slate-800 dark:text-slate-200 mt-0.5">{carSlot2.acceleration || '3.8s'}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                          <div className="text-[9px] text-slate-400 uppercase">Power</div>
                          <div className="text-slate-800 dark:text-slate-200 mt-0.5">{carSlot2.horsepower || 'High Output'}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                          <div className="text-[9px] text-slate-400 uppercase">Energy</div>
                          <div className="text-slate-800 dark:text-slate-200 mt-0.5 truncate">{carSlot2.fuel || 'Petrol'}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div 
                      onClick={() => openPicker(2)}
                      className="py-12 flex flex-col items-center justify-center text-center cursor-pointer space-y-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                        <CarIcon className="w-8 h-8" />
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Select Vehicle 2</div>
                      <p className="text-xs text-slate-400">Tap to browse luxury inventory</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Slot 3: Third Car */}
              {carSlot3 && (
                <div 
                  className="relative rounded-3xl border-2 border-indigo-500/40 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between overflow-hidden group animate-in zoom-in-95 duration-200"
                >
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                        Vehicle 3
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openPicker(3)}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveSlot3}
                          className="text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer p-1"
                          title="Remove vehicle 3"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div 
                      onClick={() => openPicker(3)}
                      className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 relative border border-black/10 dark:border-white/10 cursor-pointer group-hover:border-indigo-500/50 transition"
                    >
                      <CarPhoto 
                        src={carSlot3.imageUrl || carSlot3.image} 
                        alt={carSlot3.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                        {carSlot3.category || 'Luxury'}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{carSlot3.brand}</p>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                        {carSlot3.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400">
                          {carSlot3.price}
                        </p>
                        <span className="text-xs text-slate-400 font-medium">
                          {getMonthlyLease(carSlot3)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-white/5 text-[11px] font-semibold">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                        <div className="text-[9px] text-slate-400 uppercase">0–60 mph</div>
                        <div className="text-slate-800 dark:text-slate-200 mt-0.5">{carSlot3.acceleration || '3.6s'}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                        <div className="text-[9px] text-slate-400 uppercase">Power</div>
                        <div className="text-slate-800 dark:text-slate-200 mt-0.5">{carSlot3.horsepower || 'High Output'}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                        <div className="text-[9px] text-slate-400 uppercase">Energy</div>
                        <div className="text-slate-800 dark:text-slate-200 mt-0.5 truncate">{carSlot3.fuel || 'Petrol'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Central VS Badge (Only on 2-car view, centered between cards on desktop) */}
            {!carSlot3 && (
              <div 
                onClick={handleSwapSlots}
                title="Click to swap cars"
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-black text-sm items-center justify-center shadow-2xl border-4 border-[#FBFBFC] dark:border-slate-950 cursor-pointer hover:scale-110 active:scale-95 transition-all group"
              >
                <span className="group-hover:hidden">VS</span>
                <ArrowLeftRight className="w-5 h-5 hidden group-hover:block text-emerald-500 animate-spin-reverse" />
              </div>
            )}
          </div>

          {/* Quick Presets / Trending Showdowns */}
          {quickMatchups.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular Showdowns</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickMatchups.map((match, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectQuickMatchup(match)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{match.car1.title}</span>
                    <span className="text-rose-500 font-extrabold text-[10px]">VS</span>
                    <span>{match.car2.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Button (Matches sleek luxury bar) */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!carSlot1 || !carSlot2}
              onClick={handleStartCompare}
              className="w-full min-h-[56px] rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-between px-6 sm:px-8 transition-all shadow-xl shadow-slate-900/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                <span>Compare {carSlot3 ? '3 Vehicles' : 'Head-to-Head'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-600 hidden sm:inline">
                  Detailed Spec Breakdown
                </span>
                <span className="text-emerald-400 dark:text-emerald-600 font-black tracking-widest text-lg group-hover:translate-x-1.5 transition-transform">
                  &gt;&gt;&gt;
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCREEN 2: HEAD-TO-HEAD MATRIX (Compactable & Responsive)   */}
      {/* ======================================================== */}
      {viewState === 'matrix' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Navigation Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                hapticTab();
                setViewState('builder');
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Showdown Setup</span>
            </button>

            <div className="text-center min-w-0 px-2">
              <h2 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {carSlot1?.title} vs {carSlot2?.title} {carSlot3 ? `vs ${carSlot3?.title}` : ''}
              </h2>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Side-by-side technical evaluation
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSwapSlots}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                title="Swap vehicle order"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Swap</span>
              </button>
              <button
                type="button"
                onClick={handleShareComparison}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/30"
                title="Share this comparison"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Sticky Quick Vehicle Summary Header (Always anchored while scrolling) */}
          <div className="sticky top-12 sm:top-14 z-20 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-lg shadow-slate-900/5 p-2 sm:p-4">
            <div className={`grid ${carSlot3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:gap-4 items-center`}>
              
              {activeSlots.map(({ slot, car }) => (
                <div key={slot} className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-black/10 dark:border-white/10">
                    <CarPhoto
                      src={car?.imageUrl || car?.image}
                      alt={car?.title || `Vehicle ${slot}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block truncate">
                      Vehicle {slot} · {car?.brand}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {car?.title}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        {car?.price}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPicker(slot)}
                    className="text-[10px] font-bold text-slate-400 hover:text-emerald-500 underline shrink-0 hidden md:block"
                  >
                    Change
                  </button>
                </div>
              ))}

            </div>
          </div>

          {/* Controls Bar: Category Filters & Compact / Diff View Toggles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5">
            
            {/* Category Segmented Control Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All Specs' },
                { id: 'performance', label: 'Performance', icon: Zap },
                { id: 'pricing', label: 'Pricing & Lease', icon: Award },
                { id: 'specs', label: 'Specs', icon: Gauge },
                { id: 'features', label: 'Luxury & Tech', icon: Sparkles }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    hapticTab();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.icon && <cat.icon className="w-3 h-3" />}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* View Customizer Switches: Compact Mode & Differences Only */}
            <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-white/10">
              
              {/* Differences Only Toggle */}
              <button
                type="button"
                onClick={() => {
                  hapticAction();
                  setDiffOnly(!diffOnly);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  diffOnly
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
                title="Only show specs where vehicles differ"
              >
                <span>Differences Only</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${diffOnly ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  {diffCount}
                </span>
              </button>

              {/* Compact Mode Toggle */}
              <button
                type="button"
                onClick={() => {
                  hapticAction();
                  setIsCompact(!isCompact);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  isCompact
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle compact high-density view"
              >
                {isCompact ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                <span>{isCompact ? 'Detailed' : 'Compact'}</span>
              </button>

            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {displayedRows.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  All compared specs in this section are identical!
                </p>
                <button
                  type="button"
                  onClick={() => setDiffOnly(false)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 underline font-semibold"
                >
                  Turn off "Differences Only" to see all specs
                </button>
              </div>
            ) : (
              displayedRows.map((row, idx) => {
                const adv1 = getAdvantageBadge(row, 1);
                const adv2 = getAdvantageBadge(row, 2);
                const adv3 = carSlot3 ? getAdvantageBadge(row, 3) : null;
                const isDifferent = row.val3 !== null
                  ? (row.val1 !== row.val2 || row.val2 !== row.val3 || row.val1 !== row.val3)
                  : (row.val1 !== row.val2);

                return (
                  <div 
                    key={idx}
                    className={`transition-colors ${
                      isCompact ? 'p-2 sm:p-2.5' : 'p-3.5 sm:p-4'
                    } ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/60 dark:bg-slate-800/25'
                    } ${isDifferent && diffOnly ? 'ring-1 ring-emerald-500/20' : ''}`}
                  >
                    {/* Metric Label Row */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {row.icon && <row.icon className="w-3.5 h-3.5 text-slate-400" />}
                        <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isCompact ? row.shortLabel : row.label}
                        </span>
                      </div>
                      {isDifferent && !diffOnly && (
                        <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          Differs
                        </span>
                      )}
                    </div>

                    {/* Values Grid (2 or 3 columns) */}
                    <div className={`grid ${carSlot3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:gap-4 items-center`}>
                      
                      {/* Slot 1 Value */}
                      <div className={`p-2 rounded-xl transition ${
                        adv1 
                          ? 'bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border border-emerald-500/30' 
                          : 'bg-transparent'
                      }`}>
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className={`text-xs sm:text-sm font-bold leading-tight ${
                            adv1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {row.val1}
                          </span>
                          {adv1 && (
                            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                              {adv1}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Slot 2 Value */}
                      <div className={`p-2 rounded-xl transition ${
                        adv2 
                          ? 'bg-rose-500/[0.08] dark:bg-rose-500/[0.12] border border-rose-500/30' 
                          : 'bg-transparent'
                      }`}>
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className={`text-xs sm:text-sm font-bold leading-tight ${
                            adv2 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {row.val2}
                          </span>
                          {adv2 && (
                            <span className="text-[9px] font-black text-rose-700 dark:text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                              {adv2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Optional Slot 3 Value */}
                      {carSlot3 && (
                        <div className={`p-2 rounded-xl transition ${
                          adv3 
                            ? 'bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12] border border-indigo-500/30' 
                            : 'bg-transparent'
                        }`}>
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className={`text-xs sm:text-sm font-bold leading-tight ${
                              adv3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                            }`}>
                              {row.val3}
                            </span>
                            {adv3 && (
                              <span className="text-[9px] font-black text-indigo-700 dark:text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                                {adv3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Luxury Action Cards for each car */}
          <div className={`grid ${carSlot3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} gap-3 pt-3`}>
            {activeSlots.map(({ slot, car }) => (
              <div 
                key={slot}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Vehicle {slot} Options
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {car?.title}
                  </h4>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {car?.price} · {getMonthlyLease(car)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/car/${car.id}`)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      hapticAction();
                      setLeaseModalCar(car);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Lease Calc</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RESPONSIVE MODAL DRAWER: SELECT CAR FOR COMPARISON        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activePickerSlot !== null && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className={`w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
                darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
              }`}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">
                    Select Vehicle for Slot {activePickerSlot}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pick any luxury vehicle from your inventory
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePickerSlot(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="p-3 border-b border-slate-100 dark:border-white/10 space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Search by brand, model or keyword..."
                    className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {pickerSearch && (
                    <button
                      type="button"
                      onClick={() => setPickerSearch('')}
                      className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                  {pickerCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPickerCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        pickerCategory === cat
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat === 'all' ? 'All Classes' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cars Scroll List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                {filteredPickerCars.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No vehicles found matching your criteria.
                  </div>
                ) : (
                  filteredPickerCars.map((car) => {
                    const isCurrentlySelected = 
                      (activePickerSlot === 1 && carSlot1?.id === car.id) ||
                      (activePickerSlot === 2 && carSlot2?.id === car.id) ||
                      (activePickerSlot === 3 && carSlot3?.id === car.id);

                    return (
                      <div
                        key={car.id}
                        onClick={() => handleSelectCarForSlot(car)}
                        className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                          isCurrentlySelected
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-black/10 dark:border-white/10">
                          <CarPhoto 
                            src={car.imageUrl || car.image} 
                            alt={car.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-medium">{car.category || 'Luxury'}</span>
                          <h4 className="text-xs sm:text-sm font-bold truncate text-slate-900 dark:text-white">
                            {car.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              {car.price}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {car.acceleration || '3.5s'} · {car.horsepower || 'HP'}
                            </span>
                          </div>
                        </div>
                        {isCurrentlySelected ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 hover:text-emerald-500 shrink-0">
                            Select
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lease Calculator Modal */}
      {leaseModalCar && (
        <LeaseCalculatorModal
          isOpen={Boolean(leaseModalCar)}
          onClose={() => setLeaseModalCar(null)}
          car={leaseModalCar}
          darkMode={darkMode}
        />
      )}

    </div>
  );
}
