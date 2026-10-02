import React from 'react';
import { motion } from 'framer-motion';
import { hapticCard } from '../utils/haptics';

export default function FeaturedHeroCard({ car, onExplore }) {
  const defaultCar = {
    title: "Porsche 911 Carrera",
    price: "$128,500",
    description: "An iconic driver's car, refined for every day and engineered for the moments that matter. Selected for its performance, design, and presence.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuClUTedEAlcXDRDGHDMXqi_iAKhN6Yfr9Kja2M-63jJB9zIEwW37gAYtFvZKoyl2kZRhBjpJQcCk9I4alK1lQoxIpwylGxVhiQdGayxEgqDReAqw4jAy-j-Z308HLPOXKaAmeKrQnRXkvA19Mnr-i63Ei2zkxOkYR2Y3t62NZP1JiJg2DMN8VbRb3T8DeXknboNVk2jW-Gh-LL93ATqDnX2l93_2hl1e1Hlnu1q7xn8eqZ-GpKp7gUw"
  };

  const item = car || defaultCar;

  return (
    <section className="relative rounded-2xl overflow-hidden shadow-float bg-slate-900 border border-white/10 text-white min-h-[360px] flex flex-col justify-end p-5" data-purpose="featured-hero-card">
      {/* Background Image */}
      <img 
        alt={item.title} 
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]" 
        src={item.imageUrl} 
      />
      {/* Dark Glass Overlay */}
      <div className="absolute inset-0 hero-glass-overlay"></div>
      
      {/* Featured Card Content */}
      <div className="relative z-10 space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 text-[10px] font-medium tracking-wider uppercase text-emerald-400">
          <span>⚡</span> TOP OF THE COLLECTION
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{item.title}</h2>
          <p className="text-xl font-serif italic text-slate-300 mt-0.5">{item.price}</p>
        </div>
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
          {item.description}
        </p>

        {/* Action & Carousel Indicators */}
        <div className="pt-2 flex items-center justify-between">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              hapticCard();
              onExplore && onExplore(item);
            }}
            className="inline-flex items-center gap-2 bg-slate-950/90 hover:bg-slate-950 text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/20 backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            Explore model
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.button>
          
          <div className="flex items-center space-x-1.5">
            <span className="w-5 h-1 rounded-full bg-emerald-400"></span>
            <span className="w-2.5 h-1 rounded-full bg-white/40"></span>
            <span className="w-2.5 h-1 rounded-full bg-white/40"></span>
          </div>
        </div>
      </div>
    </section>
  );
}
