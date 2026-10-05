import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Scale, ArrowRight, Gauge, Car, ChevronDown } from 'lucide-react';
import CarPhoto from '../components/cars/CarPhoto';
import EmptyState from '../components/common/EmptyState';
import { useCarContext } from '../context/CarContext';
import { hapticAction } from '../utils/haptics';

export default function ComparePage() {
  const navigate = useNavigate();
  const { cars, compareIds, toggleCompare, darkMode } = useCarContext();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (sectionTitle) => {
    hapticAction();
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  // Compare up to 3 cars
  const compareCars = cars.filter((car) => compareIds.includes(car.id)).slice(0, 3);
  const emptySlotsCount = Math.max(0, 3 - compareCars.length);

  // Grouped Spec Categories
  const specSections = [
    {
      title: 'Performance & Speed',
      icon: Gauge,
      badge: 'Dyno & Track',
      rows: [
        {
          key: 'acceleration',
          label: '0-60 mph',
          metricKey: 'acceleration',
          getValue: (c) => c.specs?.acceleration || c.acceleration || 'Not listed',
        },
        {
          key: 'topSpeed',
          label: 'Top Speed',
          metricKey: 'topSpeed',
          getValue: (c) => c.specs?.topSpeed || c.topSpeed || 'Not listed',
        },
        {
          key: 'horsepower',
          label: 'Horsepower',
          metricKey: 'horsepower',
          getValue: (c) => c.specs?.horsepower || c.horsepower || 'Not listed',
        },
        {
          key: 'drivetrain',
          label: 'Drivetrain',
          getValue: (c) => c.drivetrain || 'AWD',
        },
        {
          key: 'transmission',
          label: 'Transmission',
          getValue: (c) => c.transmission || 'Automatic',
        },
      ],
    },
    {
      title: 'Vehicle Overview',
      icon: Car,
      badge: 'Specifications',
      rows: [
        {
          key: 'year',
          label: 'Year',
          getValue: (c) => String(c.year || '2024'),
        },
        {
          key: 'category',
          label: 'Category',
          getValue: (c) => c.category || 'Luxury',
        },
        {
          key: 'fuel',
          label: 'Fuel / Powertrain',
          getValue: (c) => c.fuelType || c.fuel || 'Petrol',
        },
        {
          key: 'mileage',
          label: 'Mileage',
          getValue: (c) => (c.mileage ? `${Number(c.mileage).toLocaleString()} mi` : 'Delivery miles'),
        },
      ],
    },
  ];

  // Numerical value extractor for metric comparisons
  const parseNum = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return null;
    const match = String(val).match(/([0-9]+(?:\.[0-9]+)?)/);
    return match ? parseFloat(match[1]) : null;
  };

  // Helper to determine superior metric advantage across currently compared cars
  const getMetricAdvantage = (rowKey, car) => {
    if (compareCars.length <= 1) return null;

    if (rowKey === 'acceleration') {
      const parsedValues = compareCars.map((c) => {
        const raw = c.specs?.acceleration || c.acceleration;
        return { id: c.id, num: parseNum(raw) };
      });
      const validNumbers = parsedValues.filter((item) => item.num !== null && !isNaN(item.num));
      if (validNumbers.length < 2) return null;

      const minAcc = Math.min(...validNumbers.map((v) => v.num));
      const currentCarVal = parseNum(car.specs?.acceleration || car.acceleration);
      
      // Winner has the strictly lowest time and not a universal tie
      const minWinners = validNumbers.filter((v) => v.num === minAcc);
      if (minWinners.length === 1 && currentCarVal === minAcc) {
        return '⚡ Faster';
      }
    }

    if (rowKey === 'horsepower') {
      const parsedValues = compareCars.map((c) => {
        const raw = c.specs?.horsepower || c.horsepower;
        return { id: c.id, num: parseNum(raw) };
      });
      const validNumbers = parsedValues.filter((item) => item.num !== null && !isNaN(item.num));
      if (validNumbers.length < 2) return null;

      const maxHp = Math.max(...validNumbers.map((v) => v.num));
      const currentCarVal = parseNum(car.specs?.horsepower || car.horsepower);
      const maxWinners = validNumbers.filter((v) => v.num === maxHp);
      if (maxWinners.length === 1 && currentCarVal === maxHp) {
        return '⚡ More Power';
      }
    }

    if (rowKey === 'topSpeed') {
      const parsedValues = compareCars.map((c) => {
        const raw = c.specs?.topSpeed || c.topSpeed;
        return { id: c.id, num: parseNum(raw) };
      });
      const validNumbers = parsedValues.filter((item) => item.num !== null && !isNaN(item.num));
      if (validNumbers.length < 2) return null;

      const maxSpeed = Math.max(...validNumbers.map((v) => v.num));
      const currentCarVal = parseNum(car.specs?.topSpeed || car.topSpeed);
      const maxWinners = validNumbers.filter((v) => v.num === maxSpeed);
      if (maxWinners.length === 1 && currentCarVal === maxSpeed) {
        return '⚡ Faster';
      }
    }

    return null;
  };

  // Helper to determine if values in a spec row differ between the currently compared cars
  const isRowDifferent = (row) => {
    if (compareCars.length <= 1) return false;
    const firstVal = row.getValue(compareCars[0]);
    return compareCars.some((car) => row.getValue(car) !== firstVal);
  };

  return (
    <div
      className={`min-h-[calc(100vh-80px)] pb-28 pt-2 transition-colors duration-200 ${
        darkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
      data-purpose="compare-screen"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#bef264]/20 text-emerald-600 dark:text-[#bef264] border border-[#bef264]/40">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Vehicle Comparison Matrix
          </h1>
          <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Review technical specifications, powertrain metrics, and showroom pricing across up to 3 shortlisted vehicles.
          </p>
        </div>

        {/* Empty State */}
        {compareCars.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="Your comparison matrix is empty"
              description="Add vehicles from the showroom garage or explore feed to compare their technical specifications side-by-side."
              actionLabel="Explore Showroom Vehicles"
              onAction={() => navigate('/')}
            />
          </div>
        ) : (
          /* Synchronized Unified Comparison Matrix */
          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[760px] lg:min-w-full">
              {/* Header Vehicle Column Cards */}
              <div className="grid grid-cols-4 gap-4 items-stretch mb-4">
                {/* Left Active Matrix Control Panel */}
                <div
                  className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                    darkMode
                      ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-sm'
                      : 'bg-slate-50/90 border-slate-200/90 shadow-sm'
                  }`}
                >
                  {/* Top: Status Badges & Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                        Active Matrix
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/70 text-slate-700'
                      }`}>
                        {compareCars.length}/3 Selected
                      </span>
                    </div>
                    <div className="text-base font-extrabold leading-snug">
                      Comparing {compareCars.length} {compareCars.length === 1 ? 'Vehicle' : 'Vehicles'}
                    </div>
                    <p className={`text-xs mt-1.5 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Synchronized side-by-side benchmark for real-time spec evaluation.
                    </p>
                  </div>

                  {/* Bottom: Consolidated Controls (Highlight Differences & Clear All) */}
                  <div className={`mt-5 pt-4 border-t space-y-3.5 ${darkMode ? 'border-slate-800/80' : 'border-slate-200/80'}`}>
                    {/* Highlight Differences Toggle */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Highlight Diff
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={highlightDifferences}
                        onClick={() => {
                          hapticAction();
                          setHighlightDifferences((prev) => !prev);
                        }}
                        className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors cursor-pointer border ${
                          highlightDifferences
                            ? 'bg-[#bef264] border-[#aee750]'
                            : darkMode
                            ? 'bg-slate-800 border-slate-700'
                            : 'bg-slate-200 border-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-slate-950 transition-transform ${
                            highlightDifferences ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Clear All Action */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticAction();
                        compareCars.forEach((c) => toggleCompare(c.id));
                      }}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                        darkMode
                          ? 'border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 hover:border-rose-900/40'
                          : 'border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-slate-100 hover:border-rose-200'
                      }`}
                    >
                      Clear Comparison
                    </button>
                  </div>
                </div>

                {/* Car Header Cards */}
                {compareCars.map((car) => (
                  <div
                    key={car.id}
                    className={`relative rounded-3xl border overflow-hidden p-4 shadow-sm transition-all flex flex-col justify-between ${
                      darkMode
                        ? 'bg-slate-900/90 border-slate-800'
                        : 'bg-white border-slate-200/90'
                    }`}
                  >
                    {/* Visible White '×' Remove Button on Top-Right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        hapticAction();
                        toggleCompare(car.id);
                      }}
                      aria-label={`Remove ${car.title || car.name} from comparison`}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-slate-950/90 text-white hover:bg-rose-600 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-white/30 shadow-md"
                    >
                      <X className="w-4 h-4 text-white stroke-[2.5]" />
                    </button>

                    <div>
                      {/* Car Thumbnail */}
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-3 bg-slate-950">
                        <CarPhoto
                          src={car.imageUrl || car.image}
                          alt={car.title || car.name}
                          className="w-full h-full object-cover filter brightness-95"
                        />
                      </div>

                      {/* Title & Brand */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {car.brand || car.category || 'Luxury'}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold line-clamp-1 leading-tight">
                        {car.title || car.name}
                      </h3>

                      {/* Bold Price */}
                      <div className="text-base sm:text-lg font-black text-emerald-500 mt-1">
                        {car.price || (car.priceAmount ? `$${Number(car.priceAmount).toLocaleString()}` : 'Inquire')}
                      </div>
                    </div>

                    {/* Primary Lime Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticAction();
                        navigate(`/car/${car.id}`);
                      }}
                      className="mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-[#bef264] hover:bg-[#aee750] text-slate-950 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                    >
                      <span>View Details / Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Empty Slot Placeholders (if fewer than 3 cars) */}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <div
                    key={`empty-slot-${idx}`}
                    onClick={() => {
                      hapticAction();
                      navigate('/');
                    }}
                    className={`rounded-3xl border-2 border-dashed min-h-[300px] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group ${
                      darkMode
                        ? 'border-slate-800 bg-slate-900/20 hover:border-slate-600 hover:bg-slate-900/40'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-800/20 dark:bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-[#bef264] group-hover:border-[#bef264] transition-all mb-3">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold block group-hover:text-emerald-500 transition-colors">
                      + Add Car to Compare
                    </span>
                    <p className={`text-[11px] mt-1 max-w-[140px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Select another model from the showroom
                    </p>
                  </div>
                ))}
              </div>

              {/* Synchronized Spec Matrix Table (Categorized Sections) */}
              <div className="space-y-4">
                {specSections.map((section) => {
                  const SectionIcon = section.icon;
                  const isCollapsed = collapsedSections[section.title];

                  return (
                    <div
                      key={section.title}
                      className={`rounded-3xl border overflow-hidden shadow-xs transition-all ${
                        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Collapsible / Distinct Section Header */}
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title)}
                        className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                          darkMode
                            ? 'bg-slate-800/40 hover:bg-slate-800/70 border-b border-slate-800/80'
                            : 'bg-slate-50/90 hover:bg-slate-100/80 border-b border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${
                            darkMode ? 'bg-slate-800 text-[#bef264]' : 'bg-white text-emerald-600 shadow-2xs'
                          }`}>
                            <SectionIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-extrabold tracking-tight">
                              {section.title}
                            </span>
                            <span className={`ml-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200/80 text-slate-600'
                            }`}>
                              {section.badge}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isCollapsed ? '-rotate-90' : 'rotate-0'
                            }`}
                          />
                        </div>
                      </button>

                      {/* Section Rows */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs">
                              {section.rows.map((row) => {
                                const different = isRowDifferent(row);
                                const shouldTint = highlightDifferences && different;

                                return (
                                  <div
                                    key={row.key}
                                    className={`grid grid-cols-4 items-center transition-colors ${
                                      shouldTint
                                        ? 'bg-[#bef264]/15 dark:bg-[#bef264]/10'
                                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-850/30'
                                    }`}
                                  >
                                    {/* Spec Row Label */}
                                    <div className="p-3.5 sm:px-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                      <span>{row.label}</span>
                                      {shouldTint && (
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#bef264]" />
                                      )}
                                    </div>

                                    {/* Compared Cars Values */}
                                    {compareCars.map((car) => {
                                      const val = row.getValue(car);
                                      const advantage = getMetricAdvantage(row.key, car);

                                      return (
                                        <div
                                          key={`${car.id}-${row.key}`}
                                          className={`p-3.5 sm:px-5 font-bold flex flex-wrap items-center gap-2 ${
                                            shouldTint
                                              ? 'text-slate-950 dark:text-white font-extrabold'
                                              : darkMode
                                              ? 'text-slate-200'
                                              : 'text-slate-800'
                                          }`}
                                        >
                                          <span className="truncate">{val}</span>
                                          {advantage && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-[#bef264] text-slate-950 shadow-xs">
                                              {advantage}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}

                                    {/* Empty Slots Column Cells */}
                                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                                      <div
                                        key={`empty-cell-${idx}`}
                                        className="p-3.5 sm:px-5 text-slate-400 dark:text-slate-600 font-medium italic"
                                      >
                                        —
                                      </div>
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

