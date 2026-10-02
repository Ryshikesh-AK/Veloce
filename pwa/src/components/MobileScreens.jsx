import React, { useEffect, useState } from 'react';

function ScreenHeading({ eyebrow, title, description, onBack }) {
  return (
    <div className="space-y-3">
      {onBack && (
        <button className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-emerald-400" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to cars
        </button>
      )}
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">{eyebrow}</div>
      <h1 className="font-serif text-3xl leading-tight text-white">{title}</h1>
      {description && <p className="max-w-sm text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-start gap-3 border-t border-white/10 py-8">
      <div className="grid size-11 place-items-center rounded-full bg-emerald-400/10 text-xl text-emerald-300" aria-hidden="true">◇</div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="max-w-sm text-sm leading-6 text-slate-400">{description}</p>
      {actionLabel && <button className="mt-1 min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

export function CarDetailsScreen({ car, isFavorite, isCompared, onBack, onFavorite, onCompare, onRequestDrive }) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  useEffect(() => {
    if (!isImageExpanded) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsImageExpanded(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isImageExpanded]);

  return (
    <section className="pwa-detail-screen space-y-5" data-purpose="car-details-screen">
      <div className="pwa-detail-heading"><ScreenHeading eyebrow="VEHICLE DETAILS" title={car.title} onBack={onBack} /></div>
      <div className="pwa-detail-image relative overflow-hidden rounded-xl bg-slate-900">
        <img className="pwa-detail-photo aspect-[1.18] w-full object-cover" src={car.imageUrl} alt={car.title} />
        <button className="pwa-full-image-trigger" type="button" onClick={() => setIsImageExpanded(true)}>View full image</button>
        <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">{car.status || car.badge || 'Available'}</span>
      </div>
      <div className="pwa-detail-price flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Price</p>
          <p className="mt-1 text-2xl font-bold text-white">{car.price}</p>
        </div>
        <div className="text-right text-sm text-emerald-300">{car.rating == null ? 'New listing' : `★ ${car.rating}`}</div>
      </div>
      <p className="pwa-detail-description text-sm leading-6 text-slate-300">{car.description || 'Visit Veloce to learn more about this vehicle.'}</p>
      <div className="pwa-detail-specs grid grid-cols-2 gap-2 border-y border-white/10 py-4">
        {[
          ['Year', car.year], ['Type', car.category], ['Mileage', `${Number(car.mileage || 0).toLocaleString()} mi`],
          ['Fuel', car.fuel || 'Not listed'], ['Transmission', car.transmission || 'Not listed'], ['Location', car.location || 'Veloce showroom']
        ].map(([label, value]) => (
          <div className="py-1" key={label}><div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div><div className="mt-1 text-sm font-medium text-slate-200">{value}</div></div>
        ))}
      </div>
      <div className="pwa-detail-actions grid grid-cols-2 gap-3">
        <button className="min-h-12 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white" onClick={onFavorite}>{isFavorite ? '♥ Saved' : '♡ Save car'}</button>
        <button className="min-h-12 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white" onClick={onCompare}>{isCompared ? '✓ In compare' : '+ Compare'}</button>
      </div>
      <button className="min-h-12 w-full rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950" onClick={onRequestDrive}>Request a test drive</button>
      {isImageExpanded && <div className="pwa-image-lightbox" role="dialog" aria-modal="true" aria-label={`${car.title} full-size image`} onClick={() => setIsImageExpanded(false)}>
        <button type="button" className="pwa-image-lightbox-close" aria-label="Close full image" onClick={() => setIsImageExpanded(false)}>Close</button>
        <img src={car.imageUrl} alt={car.title} onClick={(event) => event.stopPropagation()} />
      </div>}
    </section>
  );
}

export function CompareScreen({ cars, onRemove, onBrowse }) {
  return (
    <section className="space-y-5" data-purpose="compare-screen">
      <ScreenHeading eyebrow="SIDE BY SIDE" title="Compare your shortlist." description="Keep up to three cars here while you decide." />
      {cars.length === 0 ? <EmptyState title="Your compare list is empty" description="Add cars from Explore or open a car and tap Compare." actionLabel="Browse cars" onAction={onBrowse} /> : (
        <div className="pwa-compare-list -mx-4.5 flex snap-x gap-3 overflow-x-auto px-4.5 pb-3 no-scrollbar">
          {cars.map((car) => (
            <article className="pwa-compare-card w-[82%] min-w-[82%] snap-start overflow-hidden rounded-xl border border-white/10 bg-slate-900/70" key={car.id}>
              <img className="aspect-[1.55] w-full object-cover" src={car.imageUrl} alt={car.title} />
              <div className="space-y-4 p-4">
                <div><h2 className="text-lg font-semibold text-white">{car.title}</h2><p className="mt-1 text-xl font-bold text-emerald-300">{car.price}</p></div>
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {[
                    ['Year', car.year], ['Type', car.category], ['Mileage', `${Number(car.mileage || 0).toLocaleString()} mi`],
                    ['Fuel', car.fuel || 'Not listed'], ['Transmission', car.transmission || 'Not listed']
                  ].map(([label, value]) => <div className="flex justify-between gap-3 py-3 text-sm" key={label}><span className="text-slate-400">{label}</span><strong className="text-right font-medium text-slate-200">{value}</strong></div>)}
                </div>
                <button className="min-h-10 text-sm font-semibold text-rose-300" onClick={() => onRemove(car.id)}>Remove from compare</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function TestDrivesScreen({ requests, email, error, onFind, onBrowse }) {
  const [emailDraft, setEmailDraft] = useState(email);
  const visibleRequests = requests.filter((request) => request.customerEmail?.toLowerCase() === email.toLowerCase());

  return (
    <section className="space-y-5" data-purpose="test-drives-screen">
      <ScreenHeading eyebrow="APPOINTMENTS" title="Your test drives." description="Look up your requests and see the latest appointment status." />
      <form className="space-y-3 border-y border-white/10 py-4" onSubmit={(event) => { event.preventDefault(); onFind(emailDraft); }}>
        <label className="block text-xs font-semibold text-slate-300" htmlFor="mobile-test-drive-email">Email used for your request</label>
        <input className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-sm text-white placeholder:text-slate-500" id="mobile-test-drive-email" type="email" value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} placeholder="you@example.com" required />
        <button className="min-h-11 w-full rounded-lg border border-white/15 text-sm font-semibold text-white" type="submit">Find my requests</button>
      </form>
      {error && <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200" role="alert">{error}</p>}
      <div className="space-y-3">
        {visibleRequests.map((request) => (
          <article className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/60" key={request.id}>
            <div className="flex gap-3 p-3">
              <img className="size-20 shrink-0 rounded-lg object-cover" src={request.carImage} alt={request.carName} />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-white">{request.carName}</h2>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${request.status === 'approved' ? 'bg-emerald-400/15 text-emerald-300' : request.status === 'declined' ? 'bg-rose-400/15 text-rose-300' : 'bg-amber-300/15 text-amber-200'}`}>{request.status}</span>
                <p className="mt-2 text-xs leading-5 text-slate-400">Preferred: {new Date(request.preferredAt).toLocaleString()}</p>
                {request.approvedAt && <p className="mt-1 text-xs text-emerald-300">Confirmed: {new Date(request.approvedAt).toLocaleString()}</p>}
              </div>
            </div>
          </article>
        ))}
        {visibleRequests.length === 0 && !error && <EmptyState title={email ? 'No requests found' : 'Find your test-drive requests'} description={email ? 'No requests are linked to that email address yet.' : 'Enter the email address you used when requesting a test drive.'} actionLabel="Browse cars" onAction={onBrowse} />}
      </div>
    </section>
  );
}

export function ConciergeScreen({ onBrowse }) {
  return (
    <section className="space-y-5" data-purpose="concierge-screen">
      <ScreenHeading eyebrow="VELOCE MOTORS" title="A little help goes a long way." description="Speak with our showroom team about a vehicle, financing, or your next visit." />
      <div className="space-y-4 border-y border-white/10 py-5">
        <div><div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Showroom</div><p className="mt-1 text-sm leading-6 text-slate-200">1000 Van Ness Ave<br />San Francisco, CA</p></div>
        <div><div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Hours</div><p className="mt-1 text-sm text-slate-200">Monday to Saturday, 9:00 AM to 8:00 PM</p></div>
        <a className="flex min-h-12 items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950" href="tel:+1234567890">Call +1 (234) 567-890</a>
        <a className="flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white" href="https://www.google.com/maps/search/?api=1&query=1000%20Van%20Ness%20Ave%2C%20San%20Francisco%2C%20CA" target="_blank" rel="noreferrer">Get directions</a>
      </div>
      <button className="min-h-11 text-sm font-semibold text-emerald-300" onClick={onBrowse}>Continue browsing cars →</button>
    </section>
  );
}

export function TestDriveRequestScreen({ car, defaultEmail, error, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: defaultEmail,
    customerPhone: '',
    preferredAt: ''
  });
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <section className="space-y-5" data-purpose="test-drive-request-screen">
      <ScreenHeading eyebrow="TEST DRIVE REQUEST" title="Take it for a drive." description={car.title} onBack={onCancel} />
      <form className="space-y-4 border-y border-white/10 py-5" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, carId: car.id, carName: car.title, carImage: car.imageUrl, preferredAt: new Date(form.preferredAt).toISOString() }); }}>
        {[
          ['customerName', 'Your name', 'text', 'Jordan Miller'],
          ['customerEmail', 'Email address', 'email', 'you@example.com'],
          ['customerPhone', 'Phone number', 'tel', '+1 555 000 0000'],
          ['preferredAt', 'Preferred date and time', 'datetime-local', '']
        ].map(([field, label, type, placeholder]) => (
          <label className="block space-y-2 text-xs font-semibold text-slate-300" htmlFor={`drive-${field}`} key={field}>
            {label}
            <input className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-sm text-white placeholder:text-slate-500" id={`drive-${field}`} type={type} value={form[field]} onChange={(event) => update(field, event.target.value)} placeholder={placeholder} required={field !== 'customerPhone'} />
          </label>
        ))}
        {error && <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200" role="alert">{error}</p>}
        <button className="min-h-12 w-full rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950" type="submit">Send test-drive request</button>
      </form>
    </section>
  );
}