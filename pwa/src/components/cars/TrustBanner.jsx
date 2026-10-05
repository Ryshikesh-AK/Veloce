import React from 'react';
import { Truck, ShieldCheck, Headphones, CheckCircle2 } from 'lucide-react';

export default function TrustBanner({ darkMode }) {
  const trustItems = [
    {
      icon: Truck,
      title: 'Free Enclosed Delivery',
      text: 'Direct, insured white-glove transport to your doorstep nationwide.',
    },
    {
      icon: ShieldCheck,
      title: '200+ Point Inspection',
      text: 'Rigorous mechanical and cosmetic checks by master certified technicians.',
    },
    {
      icon: Headphones,
      title: '24/7 VIP Concierge',
      text: 'Direct access to private advisors for acquisitions, trade-ins, and financing.',
    },
    {
      icon: CheckCircle2,
      title: '7-Day Return Guarantee',
      text: 'Drive with complete confidence with our transparent return policy.',
    },
  ];

  return (
    <section
      className={`my-16 py-12 px-6 rounded-3xl max-w-7xl mx-auto border transition-colors ${
        darkMode
          ? 'bg-slate-900/60 border-slate-800'
          : 'bg-slate-50 border-slate-200/80'
      }`}
      data-purpose="trust-concierge-banner"
    >
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        {/* DRIVEX EXPERIENCE Badge */}
        <span className="inline-block bg-[#bef264]/40 text-slate-900 font-bold px-3 py-1 rounded-full text-xs tracking-wider uppercase">
          DRIVEX EXPERIENCE
        </span>
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          Why Collectors & Drivers Trust DriveX
        </h2>
        <p
          className={`text-xs sm:text-sm ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Unrivaled authenticity, white-glove logistics, and curated prestige backed by automotive specialists.
        </p>
      </div>

      {/* 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all shadow-xs hover:shadow-md ${
                darkMode
                  ? 'bg-slate-850/80 border-slate-800 text-white'
                  : 'bg-white border-slate-200/60 text-slate-900'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#bef264]/30 text-slate-900 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-1.5">
                {item.title}
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
