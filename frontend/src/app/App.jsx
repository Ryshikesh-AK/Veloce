import React, { useEffect, useMemo, useState } from 'react';
import { getPathForNavItem, tabForPath } from './navigation.js';
import { MyTestDrivesPage, TestDriveRequestModal } from '../features/test-drives/CustomerTestDrives.jsx';
import CarCard from '../features/marketplace/CarCard.jsx';
import ComparePage from '../features/compare/ComparePage.jsx';
import AdminLogin from '../features/admin/AdminLogin.jsx';
import AdminConsolePage from '../features/admin/AdminConsolePage.jsx';
import { formatPrice } from '../shared/format.js';
import { carApi, clearAdminToken, getAdminToken } from '../shared/api.js';
import {
  ArrowRight, BarChart3, Bell, CarFront, Check, ChevronDown, CircleHelp, Expand,
  CalendarDays, Clock3, Eye, Heart, LayoutGrid, Leaf, MapPin, Menu, Moon, MoreHorizontal, Phone, Plus,
  Search, Settings2, ShieldCheck, Sparkles, Sun, Trash2, Upload, UserRound,
  X, Zap
} from 'lucide-react';
import '../styles.css';

export default function App() {
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [carsError, setCarsError] = useState('');
  const [testDrives, setTestDrives] = useState([]);
  const [customerEmail, setCustomerEmail] = useState(() => localStorage.getItem('veloce-test-drive-email') || '');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [filter, setFilter] = useState('All cars');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState([2]);
  const [compare, setCompare] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [showContact, setShowContact] = useState(false);
  const [toast, setToast] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);
  const [testDriveCar, setTestDriveCar] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [adminAlerts, setAdminAlerts] = useState(() => Number(localStorage.getItem('veloce-admin-alerts') || 0));
  const [isAdmin, setIsAdmin] = useState(() => Boolean(getAdminToken()));
  const isAdminRoute = currentPath.startsWith('/admin');
  const activeTab = tabForPath(currentPath);
  const approvedTestDriveCount = testDrives.filter((request) => request.status === 'approved' && request.customerEmail === customerEmail.trim().toLowerCase()).length;

  const loadCars = async () => {
    setCarsLoading(true);
    setCarsError('');
    try {
      setCars(await carApi.list());
    } catch (error) {
      setCarsError(error.message);
    } finally {
      setCarsLoading(false);
    }
  };

  const loadTestDrives = async (admin = false) => {
    try {
      const requests = admin
        ? await carApi.listTestDrives()
        : customerEmail.trim()
          ? await carApi.listMyTestDrives(customerEmail.trim().toLowerCase())
          : [];
      setTestDrives(requests);
    } catch (error) {
      setToast(error.message);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    if (!isAdmin) loadTestDrives();
  }, [customerEmail, isAdmin]);

  useEffect(() => {
    const handleExpiredAdminSession = () => {
      setIsAdmin(false);
      setToast('Your admin session expired. Please sign in again.');
    };
    window.addEventListener('veloce-admin-session-expired', handleExpiredAdminSession);
    return () => window.removeEventListener('veloce-admin-session-expired', handleExpiredAdminSession);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const visitorIsKnown = sessionStorage.getItem('veloce-visitor-counted') === 'true';
    if (!visitorIsKnown && !isAdmin) {
      sessionStorage.setItem('veloce-visitor-counted', 'true');
      const nextAlerts = Number(localStorage.getItem('veloce-admin-alerts') || 0) + 1;
      localStorage.setItem('veloce-admin-alerts', String(nextAlerts));
      setAdminAlerts(nextAlerts);
    }
    if (sessionStorage.getItem('veloce-member') !== 'true' && localStorage.getItem('veloce-signup-dismissed') !== 'true') {
      const timer = setTimeout(() => setShowSignup(true), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isAdmin]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (item) => {
    const path = getPathForNavItem(item);
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const visibleCars = useMemo(() => cars.filter((car) => {
    const matchesWishlist = activeTab !== 'My wishlist' || wishlist.includes(car.id);
    const matchesFilter = filter === 'All cars' || car.type === filter;
    const query = search.toLowerCase();
    return matchesWishlist && matchesFilter && `${car.name} ${car.model || ''} ${car.type} ${car.location || ''}`.toLowerCase().includes(query);
  }), [activeTab, cars, filter, search, wishlist]);

  const featuredCars = useMemo(() => cars.filter((car) => car.isFeatured), [cars]);
  const carouselCars = featuredCars.length ? featuredCars : cars;
  const featuredCar = carouselCars[featuredIndex % carouselCars.length];

  useEffect(() => {
    if (carouselCars.length < 2) return undefined;
    const timer = setInterval(() => setFeaturedIndex((index) => (index + 1) % carouselCars.length), 4500);
    return () => clearInterval(timer);
  }, [carouselCars.length]);

  const toggleWishlist = (id) => {
    setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
    setToast(wishlist.includes(id) ? 'Removed from your wishlist' : 'Saved to your wishlist');
  };

  const addCar = async ({ imageFile, ...payload }) => {
    try {
      if (imageFile) payload.image = (await carApi.uploadImage(imageFile)).image;
      const car = await carApi.create(payload);
      setCars((items) => [car, ...items]);
      setToast('Car listing created');
      return true;
    } catch (error) {
      setToast(error.message);
      return false;
    }
  };

  const updateCar = async (id, { imageFile, ...changes }) => {
    try {
      if (imageFile) changes.image = (await carApi.uploadImage(imageFile)).image;
      const updatedCar = await carApi.update(id, changes);
      setCars((items) => items.map((car) => car.id === id ? updatedCar : car));
      setToast('Car listing updated');
      return true;
    } catch (error) {
      setToast(error.message);
      return false;
    }
  };

  const removeCar = async (id) => {
    try {
      await carApi.remove(id);
      setCars((items) => items.filter((car) => car.id !== id));
      setWishlist((items) => items.filter((item) => item !== id));
      setCompare((items) => items.filter((item) => item !== id));
      setSelectedCar(null);
      setToast('Car removed from the collection');
      return true;
    } catch (error) {
      setToast(error.message);
      return false;
    }
  };

  const requestTestDrive = async (requestDetails) => {
    try {
      const request = await carApi.createTestDrive(requestDetails);
      const normalizedEmail = request.customerEmail.trim().toLowerCase();
      setTestDrives((items) => [request, ...items.filter((item) => item.id !== request.id)]);
      localStorage.setItem('veloce-test-drive-email', normalizedEmail);
      setCustomerEmail(normalizedEmail);
      setTestDriveCar(null);
      navigateTo('/test-drives');
      setToast('Test-drive request added to the queue');
    } catch (error) {
      setToast(error.message);
    }
  };

  const approveTestDrive = async (id, approvedAt) => {
    try {
      const updated = await carApi.reviewTestDrive(id, 'approved', approvedAt);
      setTestDrives((items) => items.map((request) => request.id === id ? updated : request));
    } catch (error) {
      setToast(error.message);
    }
  };

  const declineTestDrive = async (id) => {
    try {
      const updated = await carApi.reviewTestDrive(id, 'declined');
      setTestDrives((items) => items.map((request) => request.id === id ? updated : request));
    } catch (error) {
      setToast(error.message);
    }
  };

  const toggleCompare = (id) => {
    setCompare((items) => {
      if (items.includes(id)) return items.filter((item) => item !== id);
      if (items.length >= 3) { setToast('Compare up to 3 cars at a time'); return items; }
      setToast('Added to compare');
      return [...items, id];
    });
  };

  const openContact = () => setShowContact(true);

  const logoutAdmin = () => {
    clearAdminToken();
    setIsAdmin(false);
  };

  if (isAdminRoute && !isAdmin) {
    return <AdminLogin onLogin={async () => { setIsAdmin(true); await loadTestDrives(true); }} />;
  }

  if (isAdminRoute && isAdmin) {
    return <><AdminConsolePage path={currentPath} cars={cars} carsLoading={carsLoading} carsError={carsError} onRetryCars={loadCars} testDrives={testDrives} adminAlerts={adminAlerts} featuredIds={cars.filter((car) => car.isFeatured).map((car) => car.id)} onApproveTestDrive={approveTestDrive} onDeclineTestDrive={declineTestDrive} onAdd={addCar} onUpdate={updateCar} onRemove={removeCar} onFeaturedChange={(id, isFeatured) => updateCar(id, { isFeatured })} onStatusChange={(id, status) => updateCar(id, { status })} onFinancialChange={(id, field, value) => updateCar(id, { [field]: value === '' ? null : Number(value) })} onPriceChange={(id, price) => updateCar(id, { price })} onClearAlerts={() => { localStorage.setItem('veloce-admin-alerts', '0'); setAdminAlerts(0); }} onNavigate={navigateTo} onClose={() => navigateTo('Discover')} onLogout={logoutAdmin} />{toast && <div className="toast" role="status"><Check size={16} /> {toast}</div>}</>;
  }

  return (
    <div className="app-shell">
      {!isOnline && <div className="offline-banner" role="status">You are offline. Live inventory and requests need a connection.</div>}
      <aside className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><CarFront size={20} strokeWidth={2.5} /></div><span>veloce<span className="brand-dot">.</span></span></div>
        <div className="sidebar-label">Workspace</div>
        <nav className="main-nav">
          {['Discover', 'My wishlist', 'Compare cars', 'My test drives'].map((item) => (
            <button key={item} className={`nav-item ${activeTab === item ? 'active' : ''}`} onClick={() => navigateTo(item)}>
              {item === 'Discover' ? <LayoutGrid size={18} /> : item === 'My wishlist' ? <Heart size={18} /> : item === 'Compare cars' ? <BarChart3 size={18} /> : <CalendarDays size={18} />}
              <span>{item}</span>{item === 'My wishlist' && <span className="nav-count">{wishlist.length}</span>}{item === 'Compare cars' && compare.length > 0 && <span className="nav-count">{compare.length}</span>}{item === 'My test drives' && approvedTestDriveCount > 0 && <span className="nav-count">{approvedTestDriveCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-label manage-label">Manage</div>
        {isAdmin && <nav className="main-nav">
          <button className="nav-item" onClick={() => navigateTo('Admin workspace')}><Settings2 size={18} /><span>Admin workspace</span><span className="admin-pill">Admin</span></button>
          <button className="nav-item" onClick={() => { localStorage.setItem('veloce-admin-alerts', '0'); setAdminAlerts(0); }}><Bell size={18} /><span>Notifications</span>{adminAlerts > 0 && <span className="nav-count">{adminAlerts}</span>}<span className="notification-dot" /></button>
        </nav>}
        <div className="sidebar-bottom">
          <button className="help-card" onClick={openContact} aria-haspopup="dialog"><div className="help-icon"><CircleHelp size={18} /></div><div><strong>Need help?</strong><span>Talk to our team</span></div><ArrowRight size={15} /></button>
          <div className="profile"><div className="avatar">JM</div><div className="profile-copy"><strong>Jordan Miller</strong><span>Member since 2021</span></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={20} /></button><div className="breadcrumb"><span>Marketplace</span><span>/</span><strong>{activeTab}</strong></div><div className="topbar-actions"><button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="avatar small-avatar">JM</button></div></header>
        <div className="page-content">
          {activeTab === 'Discover' && <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" /> CURATED FOR YOU</div><h1>Find a car that<br /><em>feels like you.</em></h1><p className="hero-copy">A considered collection of exceptional cars, selected for how you live and where you’re going.</p></div><div className="stats-strip"><div><strong>{cars.length}</strong><span>Cars available</span></div><div><strong>24</strong><span>Trusted brands</span></div><div><strong>4.9<span className="star">★</span></strong><span>Average rating</span></div></div></section>}
          {activeTab === 'Discover' && featuredCar && <section className="hero-banner"><div className="hero-banner-copy"><div className="hero-kicker"><Zap size={14} fill="currentColor" /> TOP OF THE COLLECTION</div><h2>{featuredCar.name}<br /><span>{formatPrice(featuredCar.price, featuredCar.currency)}</span></h2><p>{featuredCar.description}<br />Selected for its performance, design, and presence.</p><button className="primary-button" onClick={() => { setSearch(featuredCar.name); navigateTo('Discover'); }}>Explore model <ArrowRight size={16} /></button><div className="hero-dots">{carouselCars.map((car, index) => <button key={car.id} aria-label={`Show ${car.name}`} className={index === featuredIndex % carouselCars.length ? 'active' : ''} onClick={() => setFeaturedIndex(index)} />)}</div></div><div className="hero-car-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(208,216,216,.98) 0%, rgba(208,216,216,.83) 30%, rgba(208,216,216,.05) 61%), url('${featuredCar.image}')` }} /></section>}
          {activeTab === 'My test drives' ? <MyTestDrivesPage requests={testDrives} email={customerEmail} onEmailChange={(email) => { const normalizedEmail = email.trim().toLowerCase(); setCustomerEmail(normalizedEmail); localStorage.setItem('veloce-test-drive-email', normalizedEmail); }} onBrowse={() => navigateTo('Discover')} /> : activeTab !== 'Compare cars' ? <section className="collection-section"><div className="section-head"><div><div className="eyebrow muted">{activeTab === 'My wishlist' ? 'SAVED FOR LATER' : 'THE COLLECTION'}</div><h2>{activeTab === 'My wishlist' ? <>Your <em>wishlist.</em></> : <>Cars worth <em>knowing.</em></>}</h2></div><button className="text-button" onClick={() => { setFilter('All cars'); setSearch(''); navigateTo('Discover'); }}>View all <ArrowRight size={16} /></button></div>
            <div className="filter-bar"><div className="filter-tabs">{['All cars', 'Electric', 'Sports', 'SUV', 'MPV'].map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by model, make..." /></label><button className="sort-button"><span>Sort by</span> Featured <ChevronDown size={15} /></button></div>
            {carsError ? <div className="empty-state"><h3>Could not load cars</h3><p>{carsError}</p><button className="secondary-button" onClick={loadCars}>Retry</button></div> : carsLoading ? <div className="empty-state">Loading cars…</div> : <div className="car-grid">{visibleCars.map((car, index) => <CarCard key={car.id} car={car} index={index} liked={wishlist.includes(car.id)} compared={compare.includes(car.id)} onOpen={() => setSelectedCar(car)} onLike={() => toggleWishlist(car.id)} onCompare={() => toggleCompare(car.id)} />)}{visibleCars.length === 0 && <div className="empty-state">{activeTab === 'My wishlist' ? <Heart size={25} /> : <Search size={25} />}<h3>{activeTab === 'My wishlist' ? 'Your wishlist is empty' : 'No cars found'}</h3><p>{activeTab === 'My wishlist' ? 'Like a car to save it here for later.' : 'Try another model, make, or category.'}</p></div>}</div>}
          </section> : <ComparePage cars={cars.filter((car) => compare.includes(car.id))} onRemove={toggleCompare} onBrowse={() => navigateTo('Discover')} />}
          <footer className="footer"><div className="footer-brand"><div className="brand-mark"><CarFront size={17} /></div><strong>veloce<span className="brand-dot">.</span></strong><span>© 2024 Veloce Motors</span></div><div className="footer-links"><span><ShieldCheck size={15} /> Secure marketplace</span><button onClick={openContact}><Phone size={15} /> Contact support</button></div></footer>
        </div>
      </main>
      <button className="whatsapp-button" onClick={openContact}><Phone size={16} /><span>Contact us</span></button>
      {compare.length > 0 && activeTab !== 'Compare cars' && <button className="compare-float" onClick={() => navigateTo('Compare')}><BarChart3 size={17} /><span>{compare.length} selected</span><ArrowRight size={15} /></button>}
      {selectedCar && <CarDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} onTestDrive={(car) => { setSelectedCar(null); setTestDriveCar(car); }} />}
      {testDriveCar && <TestDriveRequestModal car={testDriveCar} defaultEmail={customerEmail} onClose={() => setTestDriveCar(null)} onSubmit={requestTestDrive} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showSignup && <SignupModal onClose={() => { localStorage.setItem('veloce-signup-dismissed', 'true'); setShowSignup(false); }} onSubmit={(user) => { sessionStorage.setItem('veloce-member', 'true'); localStorage.setItem('veloce-signup-dismissed', 'true'); setShowSignup(false); setToast(`Welcome, ${user.name}`); }} />}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function AdminWorkspacePage({ cars, featuredIds, adminAlerts, onAdd, onRemove, onFeaturedChange, onClose }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return <main className="admin-workspace-page"><header className="admin-workspace-topbar"><div className="brand"><div className="brand-mark"><CarFront size={20} strokeWidth={2.5} /></div><span>veloce<span className="brand-dot">.</span></span></div><div className="admin-workspace-heading"><div className="eyebrow muted">SECURE ADMIN AREA</div><h1>Admin workspace</h1></div><div className="admin-topbar-actions"><span className="admin-session-status"><ShieldCheck size={15} /> Admin session active</span><button className="secondary-button" onClick={() => scrollTo('garage')}><CarFront size={14} /> Garage</button><button className="secondary-button" onClick={onClose}>Back to marketplace</button></div></header><div className="admin-workspace-body"><div className="admin-overview"><div><div className="eyebrow muted">CATALOG CONTROL CENTER</div><h2>Manage your marketplace.</h2><p>Add listings, curate the landing page, remove unavailable cars, and monitor new visitors.</p></div><div className="admin-overview-stat"><strong>{cars.length}</strong><span>Live listings</span></div><div className="admin-overview-stat"><strong>{featuredIds.length}</strong><span>Featured cars</span></div><div className="admin-overview-stat"><strong>{adminAlerts}</strong><span>New visitors</span></div></div><AdminPanel cars={cars} featuredIds={featuredIds} standalone onClose={onClose} onAdd={onAdd} onRemove={onRemove} onFeaturedChange={onFeaturedChange} /><section className="admin-garage" id="garage"><div className="garage-header"><div><div className="eyebrow muted">INVENTORY</div><h2>Your garage</h2><p>Every uploaded car in one place.</p></div><button className="primary-button" onClick={() => scrollTo('catalog-controls')}><Plus size={16} /> Add car</button></div><div className="garage-grid">{cars.map((car) => <article className="garage-card" key={car.id}><div className="garage-image"><img src={car.image} alt={car.name} /><span>{car.type}</span></div><div className="garage-card-body"><div><h3>{car.name}{car.model ? ` ${car.model}` : ''}</h3><p>{car.year} · {car.location}</p></div><strong>{formatPrice(car.price)}</strong><div className="garage-specs"><span>{car.mileage ? `${Number(car.mileage).toLocaleString()} mi` : '12,400 mi'}</span><span>{car.fuel || car.type}</span><span>{car.transmission || 'Automatic'}</span></div><button className="remove-button" onClick={() => onRemove(car.id)}><Trash2 size={14} /> Delete car</button></div></article>)}</div></section></div></main>;
}

function ContactModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('1000 Van Ness Ave, San Francisco, CA');

  return <div className="modal-backdrop contact-backdrop" onClick={onClose}><section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onClick={(event) => event.stopPropagation()}><div className="panel-header"><div className="eyebrow muted">VELOCE MOTORS</div><button className="close-button" onClick={onClose} aria-label="Close contact details"><X size={19} /></button></div><h2 id="contact-title">Showroom &amp; Contact</h2><p className="contact-intro">Visit our San Francisco flagship or speak directly with our sales team.</p><div className="contact-details"><a className="contact-detail" href={directionsUrl} target="_blank" rel="noreferrer"><span className="contact-detail-icon"><MapPin size={18} /></span><span className="contact-detail-copy"><small>Main Flagship</small><strong>1000 Van Ness Ave,<br />San Francisco, CA</strong></span><ArrowRight size={16} /></a><div className="contact-detail"><span className="contact-detail-icon"><Clock3 size={18} /></span><span className="contact-detail-copy"><small>Hours</small><strong>Mon - Sat: 9:00 AM - 8:00 PM</strong></span></div><a className="contact-detail" href="tel:+1234567890"><span className="contact-detail-icon"><Phone size={18} /></span><span className="contact-detail-copy"><small>Direct Sales</small><strong>+1 (234) 567-890</strong></span><ArrowRight size={16} /></a></div><a className="primary-button contact-call-button" href="tel:+1234567890"><Phone size={15} /> Call direct sales</a></section></div>;
}

function SignupModal({ onClose, onSubmit }) {
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const update = (key, value) => setUser((current) => ({ ...current, [key]: value }));
  return <div className="modal-backdrop signup-backdrop"><div className="signup-modal"><button className="close-button signup-close" onClick={onClose} aria-label="Close sign up"><X size={19} /></button><div className="signup-mark"><Sparkles size={19} /></div><div className="eyebrow muted">WELCOME TO VELOCE</div><h2>Stay close to<br /><em>the right car.</em></h2><p>Sign up to save your shortlist, receive new arrivals, and get first access to exceptional cars.</p><form onSubmit={(event) => { event.preventDefault(); onSubmit(user); }}><label>Your name<input required value={user.name} onChange={(event) => update('name', event.target.value)} placeholder="Jordan Miller" /></label><label>Email address<input required type="email" value={user.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" /></label><label>Phone number <span className="optional-label">Optional</span><input value={user.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+1 555 000 0000" /></label><button className="primary-button" type="submit">Create my account <ArrowRight size={16} /></button></form><small>By continuing, you agree to receive occasional Veloce updates.</small></div></div>;
}

function AdminPanel({ cars, featuredIds, standalone = false, onClose, onAdd, onRemove, onFeaturedChange }) {
  const [form, setForm] = useState({ name: '', model: '', year: '2024', type: 'SUV', price: '', mileage: '', fuel: 'Electric', transmission: 'Automatic', description: '', image: '' });
  const [preview, setPreview] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const handleFile = (event) => { const file = event.target.files?.[0]; if (file) { update('image', file.name); setPreview(URL.createObjectURL(file)); } };
  const submit = (event) => { event.preventDefault(); if (!form.name || !form.model || !form.price || !form.mileage) return; onAdd({ ...form, id: Date.now(), price: Number(form.price), rating: 'New', location: 'Veloce showroom', image: preview || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85', accent: 'new' }); };
  const toggleFeatured = (id) => onFeaturedChange(featuredIds.includes(id) ? featuredIds.filter((item) => item !== id) : [...featuredIds, id]);
  return <div id={standalone ? 'catalog-controls' : undefined} className={`modal-backdrop ${standalone ? 'admin-page-backdrop' : ''}`}><aside className="admin-panel"><div className="panel-header"><div><div className="eyebrow muted">CATALOG MANAGEMENT</div><h2>Admin controls</h2></div><button className="close-button" onClick={onClose}><X size={20} /></button></div><p className="panel-intro">Create listings, remove cars, and choose exactly which cars appear in the landing-page feature carousel.</p><div className="admin-section"><div className="admin-section-title"><strong>Landing page selection</strong><span>{featuredIds.length} selected</span></div><div className="feature-list">{cars.map((car) => <label className="feature-option" key={car.id}><input type="checkbox" checked={featuredIds.includes(car.id)} onChange={() => toggleFeatured(car.id)} /><img src={car.image} alt="" /><span>{car.name}</span><b>{formatPrice(car.price)}</b></label>)}</div></div><form onSubmit={submit}><div className="admin-section-title"><strong>Add a car</strong><span>Required fields marked *</span></div><label>Make / brand *<input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Tesla" required /></label><label>Car model *<input value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="e.g. Model S Plaid" required /></label><div className="form-row"><label>Year<select value={form.year} onChange={(e) => update('year', e.target.value)}><option>2026</option><option>2025</option><option>2024</option><option>2023</option><option>2022</option></select></label><label>Category<select value={form.type} onChange={(e) => update('type', e.target.value)}><option>SUV</option><option>Sports</option><option>Electric</option><option>Sedan</option></select></label></div><div className="form-row"><label>Mileage *<input type="number" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} placeholder="12000" required /></label><label>Price *<div className="input-prefix"><span>$</span><input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="85000" required /></div></label></div><div className="form-row"><label>Fuel type<select value={form.fuel} onChange={(e) => update('fuel', e.target.value)}><option>Electric</option><option>Petrol</option><option>Diesel</option><option>Hybrid</option></select></label><label>Transmission<select value={form.transmission} onChange={(e) => update('transmission', e.target.value)}><option>Automatic</option><option>Manual</option></select></label></div><label>Vehicle description<textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell buyers what makes this car special..." rows="4" /></label><label>Car imagery<div className="upload-box">{preview ? <img src={preview} alt="Upload preview" /> : <><div className="upload-icon"><Upload size={19} /></div><strong>Drop images here or <span>browse</span></strong><small>JPG, PNG up to 10MB · 3D image supported</small></>}<input type="file" accept="image/*" onChange={handleFile} /></div></label><div className="admin-note"><Sparkles size={17} /><span><strong>Pro tip</strong> Listings with 3+ images get 2.4× more interest.</span></div><div className="panel-actions"><button type="button" className="secondary-button" onClick={onClose}>Close</button><button className="primary-button" type="submit"><Plus size={16} /> Publish car</button></div></form><div className="admin-section remove-section"><div className="admin-section-title"><strong>Remove existing cars</strong><span>Permanent catalog action</span></div>{cars.map((car) => <div className="remove-row" key={car.id}><span>{car.name}</span><button type="button" className="remove-button" onClick={() => onRemove(car.id)}><Trash2 size={14} /> Remove</button></div>)}</div></aside></div>;
}

function CarDetailsModal({ car, onClose, onTestDrive }) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const specifications = [
    ['Model', car.model || car.name],
    ['Year', car.year],
    ['Mileage', car.mileage ? `${Number(car.mileage).toLocaleString()} miles` : 'Not listed'],
    ['Fuel type', car.fuel || car.type],
    ['Transmission', car.transmission || 'Automatic'],
    ['Location', car.location]
  ];

  const carIsAvailable = !car.status || car.status === 'Available';

  useEffect(() => {
    if (!isImageExpanded) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsImageExpanded(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isImageExpanded]);

  return <div className="modal-backdrop details-backdrop" onClick={onClose}>
    <div className="details-modal" onClick={(event) => event.stopPropagation()}>
      <button className="close-button details-close" onClick={onClose} aria-label="Close vehicle details"><X size={20} /></button>
      <div className="details-hero">
        <img src={car.image} alt={car.name} />
        <div className="details-hero-overlay"><span className="condition-tag">Used vehicle</span><div><div className="eyebrow">VEHICLE DETAILS</div><h2>{car.name}{car.model ? ` ${car.model}` : ''}</h2><strong>{formatPrice(car.price, car.currency)}</strong></div></div>
        <button className="details-image-expand" type="button" onClick={() => setIsImageExpanded(true)}><Expand size={16} /> View full image</button>
      </div>
      <div className="details-body">
        <p className="details-description">{car.description || 'See the seller’s description for condition and service history.'}</p>
        <div className="spec-grid">{specifications.map(([label, value]) => <div className="spec-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <div className="details-actions">{carIsAvailable ? <button className="primary-button details-contact" onClick={() => onTestDrive(car)}><CalendarDays size={15} /> Request a test drive</button> : <span className="test-drive-unavailable">This car is not currently available for test drives.</span>}<button className="secondary-button" onClick={() => window.open('https://wa.me/14155550148?text=Hi%20Veloce%20Motors%2C%20I%27m%20interested%20in%20the%20' + encodeURIComponent(car.name), '_blank')}><Phone size={15} /> Ask about this car</button></div>
      </div>
    </div>
    {isImageExpanded && <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`${car.name} full-size image`} onClick={(event) => { event.stopPropagation(); setIsImageExpanded(false); }}>
      <button className="close-button image-lightbox-close" type="button" aria-label="Close full image" onClick={() => setIsImageExpanded(false)}><X size={22} /></button>
      <img src={car.image} alt={`${car.name}${car.model ? ` ${car.model}` : ''}`} onClick={(event) => event.stopPropagation()} />
    </div>}
  </div>;
}


