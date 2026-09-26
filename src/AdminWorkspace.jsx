import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bell, CarFront, Check, LayoutDashboard,
  Plus, Search, ShieldCheck, Sparkles, Trash2, Upload
} from 'lucide-react';

const formatPrice = (price) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(price);

const sections = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/inventory', label: 'Inventory', icon: CarFront },
  { path: '/admin/featured', label: 'Featured cars', icon: Sparkles },
  { path: '/admin/new', label: 'Add a car', icon: Plus },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell }
];

const getActivePath = (path) => sections.some((section) => section.path === path) ? path : '/admin';

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="admin-section-heading">
      <div>
        <div className="eyebrow muted">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function AdminConsolePage({
  path, cars, featuredIds, adminAlerts, onAdd, onRemove,
  onFeaturedChange, onClearAlerts, onNavigate, onClose
}) {
  const activePath = getActivePath(path);

  return (
    <div className="admin-console">
      <aside className="admin-console-sidebar">
        <a className="brand admin-console-brand" href="/" onClick={(event) => { event.preventDefault(); onClose(); }}>
          <span className="brand-mark"><CarFront size={20} strokeWidth={2.5} /></span>
          <span>veloce<span className="brand-dot">.</span></span>
        </a>
        <div className="admin-console-label">Admin workspace</div>
        <nav className="admin-console-nav" aria-label="Admin pages">
          {sections.map(({ path: sectionPath, label, icon: Icon }) => (
            <button
              key={sectionPath}
              className={`admin-console-nav-item ${activePath === sectionPath ? 'active' : ''}`}
              aria-current={activePath === sectionPath ? 'page' : undefined}
              onClick={() => onNavigate(sectionPath)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {sectionPath === '/admin/notifications' && adminAlerts > 0 && <span className="nav-count">{adminAlerts}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-console-sidebar-bottom">
          <span className="admin-session-status"><ShieldCheck size={15} /> Admin session active</span>
          <button className="secondary-button" onClick={onClose}><ArrowLeft size={15} /> Back to marketplace</button>
        </div>
      </aside>

      <main className="admin-console-main">
        <header className="admin-console-topbar">
          <div className="admin-console-breadcrumb"><span>Veloce Motors</span><span>/</span><strong>{sections.find((section) => section.path === activePath)?.label}</strong></div>
          <span className="admin-session-status"><ShieldCheck size={15} /> Secure admin area</span>
        </header>
        <div className="admin-console-content">
          <div className="admin-page-transition" key={activePath}>
            {activePath === '/admin' && <OverviewPage cars={cars} featuredIds={featuredIds} adminAlerts={adminAlerts} onNavigate={onNavigate} />}
            {activePath === '/admin/inventory' && <InventoryPage cars={cars} onRemove={onRemove} onNavigate={onNavigate} />}
            {activePath === '/admin/featured' && <FeaturedPage cars={cars} featuredIds={featuredIds} onFeaturedChange={onFeaturedChange} />}
            {activePath === '/admin/new' && <CreateCarPage onAdd={onAdd} onDone={() => onNavigate('/admin/inventory')} />}
            {activePath === '/admin/notifications' && <NotificationsPage count={adminAlerts} onClear={onClearAlerts} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewPage({ cars, featuredIds, adminAlerts, onNavigate }) {
  return (
    <>
      <SectionHeading eyebrow="CATALOG CONTROL CENTER" title="Good to see you." description="A clear view of your marketplace, listings, and featured collection." action={<button className="primary-button" onClick={() => onNavigate('/admin/new')}><Plus size={16} /> Add a car</button>} />
      <div className="admin-metrics">
        <div className="admin-metric"><span>Live listings</span><strong>{cars.length}</strong><small>Vehicles in your inventory</small></div>
        <div className="admin-metric"><span>Featured cars</span><strong>{featuredIds.length}</strong><small>Shown in the home carousel</small></div>
        <div className="admin-metric"><span>New visitors</span><strong>{adminAlerts}</strong><small>Since notifications were cleared</small></div>
      </div>
      <section className="admin-quick-actions">
        <div className="admin-section-heading"><div><div className="eyebrow muted">QUICK ACTIONS</div><h3>Where would you like to go?</h3></div></div>
        <div className="admin-action-list">
          <button onClick={() => onNavigate('/admin/inventory')}><CarFront size={19} /><span><strong>Manage inventory</strong><small>Review, update, or remove listings</small></span><ArrowRight size={17} /></button>
          <button onClick={() => onNavigate('/admin/featured')}><Sparkles size={19} /><span><strong>Choose featured cars</strong><small>Curate the homepage carousel</small></span><ArrowRight size={17} /></button>
          <button onClick={() => onNavigate('/admin/notifications')}><Bell size={19} /><span><strong>View notifications</strong><small>{adminAlerts ? `${adminAlerts} new visitor ${adminAlerts === 1 ? 'session' : 'sessions'}` : 'No unread visitor activity'}</small></span><ArrowRight size={17} /></button>
        </div>
      </section>
    </>
  );
}

function InventoryPage({ cars, onRemove, onNavigate }) {
  const [query, setQuery] = useState('');
  const filteredCars = cars.filter((car) => `${car.name} ${car.model || ''} ${car.type}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <SectionHeading eyebrow="YOUR CATALOG" title="Inventory" description={`${cars.length} ${cars.length === 1 ? 'vehicle' : 'vehicles'} currently listed.`} action={<button className="primary-button" onClick={() => onNavigate('/admin/new')}><Plus size={16} /> Add a car</button>} />
      <label className="admin-inventory-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your inventory" /></label>
      <div className="admin-inventory-list">
        {filteredCars.map((car) => (
          <article className="admin-inventory-row" key={car.id}>
            <img src={car.image} alt={car.name} />
            <div className="admin-inventory-copy"><strong>{car.name}{car.model ? ` ${car.model}` : ''}</strong><span>{car.year} · {car.type} · {car.location}</span></div>
            <strong className="admin-inventory-price">{formatPrice(car.price)}</strong>
            <button className="remove-button" onClick={() => onRemove(car.id)}><Trash2 size={14} /> Remove</button>
          </article>
        ))}
        {filteredCars.length === 0 && <div className="admin-empty-state">{cars.length ? 'No listings match that search.' : 'Your inventory is empty. Add your first car to get started.'}</div>}
      </div>
    </>
  );
}

function FeaturedPage({ cars, featuredIds, onFeaturedChange }) {
  const toggleFeatured = (id) => onFeaturedChange(featuredIds.includes(id) ? featuredIds.filter((item) => item !== id) : [...featuredIds, id]);

  return (
    <>
      <SectionHeading eyebrow="HOMEPAGE CURATION" title="Featured cars" description="Choose the vehicles that appear in the homepage feature carousel." />
      <section className="admin-featured-section">
        <div className="admin-section-heading"><div><h3>Carousel selection</h3><p>{featuredIds.length} {featuredIds.length === 1 ? 'car' : 'cars'} selected</p></div></div>
        <div className="admin-featured-list">
          {cars.map((car) => (
            <label className="admin-featured-row" key={car.id}>
              <input type="checkbox" checked={featuredIds.includes(car.id)} onChange={() => toggleFeatured(car.id)} />
              <img src={car.image} alt="" />
              <span><strong>{car.name}{car.model ? ` ${car.model}` : ''}</strong><small>{car.year} · {car.type}</small></span>
              <b>{formatPrice(car.price)}</b>
            </label>
          ))}
          {cars.length === 0 && <div className="admin-empty-state">Add cars to your inventory before featuring them.</div>}
        </div>
      </section>
    </>
  );
}

function CreateCarPage({ onAdd, onDone }) {
  const [form, setForm] = useState({ name: '', model: '', year: '2024', type: 'SUV', price: '', mileage: '', fuel: 'Electric', transmission: 'Automatic', description: '', image: '' });
  const [preview, setPreview] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      update('image', file.name);
      setPreview(URL.createObjectURL(file));
    }
  };
  const submit = (event) => {
    event.preventDefault();
    onAdd({ ...form, id: Date.now(), price: Number(form.price), rating: 'New', location: 'Veloce showroom', image: preview || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85', accent: 'new' });
    onDone();
  };

  return (
    <>
      <SectionHeading eyebrow="NEW LISTING" title="Add a car" description="Enter the vehicle details and publish it to your marketplace inventory." />
      <div className="admin-create-panel">
        <form className="admin-create-form" onSubmit={submit}>
          <div className="admin-form-section-title"><strong>Vehicle details</strong><span>Fields marked * are required</span></div>
          <div className="form-row"><label>Make / brand *<input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Tesla" required /></label><label>Model *<input value={form.model} onChange={(event) => update('model', event.target.value)} placeholder="e.g. Model S Plaid" required /></label></div>
          <div className="form-row"><label>Year<select value={form.year} onChange={(event) => update('year', event.target.value)}>{['2026', '2025', '2024', '2023', '2022'].map((year) => <option key={year}>{year}</option>)}</select></label><label>Category<select value={form.type} onChange={(event) => update('type', event.target.value)}>{['SUV', 'Sports', 'Electric', 'Sedan'].map((type) => <option key={type}>{type}</option>)}</select></label></div>
          <div className="form-row"><label>Mileage *<input type="number" min="0" value={form.mileage} onChange={(event) => update('mileage', event.target.value)} placeholder="12000" required /></label><label>Price *<span className="input-prefix"><span>$</span><input type="number" min="1" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="85000" required /></span></label></div>
          <div className="form-row"><label>Fuel type<select value={form.fuel} onChange={(event) => update('fuel', event.target.value)}>{['Electric', 'Petrol', 'Diesel', 'Hybrid'].map((fuel) => <option key={fuel}>{fuel}</option>)}</select></label><label>Transmission<select value={form.transmission} onChange={(event) => update('transmission', event.target.value)}><option>Automatic</option><option>Manual</option></select></label></div>
          <label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Tell buyers what makes this car special..." rows="4" /></label>
          <label>Vehicle image<div className="upload-box admin-upload-box">{preview ? <img src={preview} alt="Selected vehicle preview" /> : <><div className="upload-icon"><Upload size={19} /></div><strong>Choose an image <span>to preview it here</span></strong><small>JPG or PNG image</small></>}<input type="file" accept="image/*" onChange={handleFile} /></div></label>
          <div className="admin-form-actions"><button className="secondary-button" type="button" onClick={() => onDone()}>Cancel</button><button className="primary-button" type="submit"><Plus size={16} /> Publish listing</button></div>
        </form>
      </div>
    </>
  );
}

function NotificationsPage({ count, onClear }) {
  return (
    <>
      <SectionHeading eyebrow="ACTIVITY" title="Notifications" description="Visitor activity recorded for this admin session." action={count > 0 && <button className="secondary-button" onClick={onClear}><Check size={15} /> Mark all as read</button>} />
      <section className="admin-notification-row">
        <span className="admin-notification-icon"><Bell size={18} /></span>
        <div><strong>{count ? `${count} new visitor ${count === 1 ? 'session' : 'sessions'}` : 'You’re all caught up'}</strong><p>{count ? 'New marketplace visitors have arrived since you last cleared notifications.' : 'New visitor activity will appear here.'}</p></div>
        {count > 0 && <span className="admin-notification-count">{count}</span>}
      </section>
    </>
  );
}