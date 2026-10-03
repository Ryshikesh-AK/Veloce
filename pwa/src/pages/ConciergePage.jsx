import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeading from '../components/common/ScreenHeading';

export default function ConciergePage() {
  const navigate = useNavigate();

  return (
    <section className="space-y-5 max-w-xl mx-auto" data-purpose="concierge-screen">
      <ScreenHeading
        eyebrow="DriveXCars MOTORS"
        title="A little help goes a long way."
        description="Speak with our showroom team about a vehicle, financing, or your next visit."
      />
      <div className="space-y-4 border-y border-white/10 py-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Showroom</div>
          <p className="mt-1 text-sm leading-6 text-slate-200">
            1000 Van Ness Ave
            <br />
            San Francisco, CA
          </p>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Hours</div>
          <p className="mt-1 text-sm text-slate-200">Monday to Saturday, 9:00 AM to 8:00 PM</p>
        </div>
        <a
          className="flex min-h-12 items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950 hover:bg-emerald-300 transition-colors"
          href="tel:+1234567890"
        >
          Call +1 (234) 567-890
        </a>
        <a
          className="flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          href="mailto:info@drivexcars.co.uk"
        >
          Email info@drivexcars.co.uk
        </a>
        <a
          className="flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          href="https://www.google.com/maps/search/?api=1&query=1000%20Van%20Ness%20Ave%2C%20San%20Francisco%2C%20CA"
          target="_blank"
          rel="noreferrer"
        >
          Get directions
        </a>
      </div>
      <button
        type="button"
        className="min-h-11 text-sm font-semibold text-emerald-300 hover:text-emerald-200 cursor-pointer"
        onClick={() => navigate('/')}
      >
        Continue browsing cars →
      </button>
    </section>
  );
}
