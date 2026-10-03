import React, { useEffect, useState } from 'react';
import { formatPrice } from '../../shared/format.js';
import CarPhoto from '../../shared/CarPhoto.jsx';
import {
  ArrowLeft, ArrowRight, CalendarDays, CarFront, Check, CircleDollarSign, LayoutDashboard,
  LogOut, Pencil, Plus, Search, ShieldCheck, Sparkles, Trash2, Upload, X
} from 'lucide-react';

const sections = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/inventory', label: 'Inventory', icon: CarFront },
  { path: '/admin/test-drives', label: 'Test-drive queue', icon: CalendarDays },
  { path: '/admin/finance', label: 'Financial overview', icon: CircleDollarSign },
  { path: '/admin/featured', label: 'Featured cars', icon: Sparkles },
  { path: '/admin/new', label: 'Add a car', icon: Plus }
];

const getActivePath = (path) => path.startsWith('/admin/edit/') ? '/admin/edit' : sections.some((section) => section.path === path) ? path : '/admin';

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
  path, cars, carsLoading, carsError, onRetryCars, featuredIds, adminEmail, onAdd, onUpdate, onRemove,
  testDrives, onApproveTestDrive, onDeclineTestDrive, onFeaturedChange, onStatusChange,
  onFinancialChange, onPriceChange, onNavigate, onClose, onLogout
}) {
  const activePath = getActivePath(path);
  const [inventoryStatus, setInventoryStatus] = useState('All');
  const editingCar = activePath === '/admin/edit' ? cars.find((car) => car.id === Number(path.split('/').pop())) : null;

  return (
    <div className="admin-console">
      <aside className="admin-console-sidebar">
        <a className="brand admin-console-brand" href="/" onClick={(event) => { event.preventDefault(); onClose(); }}>
          <span className="brand-mark"><CarFront size={20} strokeWidth={2.5} /></span>
          <span>DriveXCars<span className="brand-dot">.</span></span>
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
              {sectionPath === '/admin/test-drives' && testDrives.filter((request) => request.status === 'pending').length > 0 && <span className="nav-count">{testDrives.filter((request) => request.status === 'pending').length}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-console-sidebar-bottom">
          <button className="secondary-button" onClick={onClose}><ArrowLeft size={15} /> Back to marketplace</button>
          <button className="secondary-button" onClick={onLogout}><LogOut size={15} /> Sign out</button>
        </div>
      </aside>

      <main className="admin-console-main">
        <header className="admin-console-topbar">
          <div className="admin-console-breadcrumb"><span>DriveXCars Motors</span><span>/</span><strong>{activePath === '/admin/edit' ? 'Edit car' : sections.find((section) => section.path === activePath)?.label}</strong></div>
          <div className="admin-console-topbar-actions">
            <div className="admin-account-status" title={adminEmail || 'Administrator account'}>
              <ShieldCheck size={16} />
              <span><small>Signed in as</small><strong>{adminEmail || 'Administrator'}</strong></span>
            </div>
            <button className="secondary-button admin-topbar-signout" onClick={onLogout}><LogOut size={15} /><span>Sign out</span></button>
          </div>
        </header>
        <div className="admin-console-content">
          <div className="admin-page-transition" key={activePath}>
            {activePath === '/admin' && <OverviewPage cars={cars} featuredIds={featuredIds} testDrives={testDrives} adminEmail={adminEmail} onNavigate={onNavigate} onStatusSelect={(status) => { setInventoryStatus(status); onNavigate('/admin/inventory'); }} />}
            {activePath === '/admin/inventory' && <InventoryPage cars={cars} carsLoading={carsLoading} carsError={carsError} onRetryCars={onRetryCars} statusFilter={inventoryStatus} onStatusFilterChange={setInventoryStatus} onRemove={onRemove} onUpdate={onUpdate} onStatusChange={onStatusChange} onFinancialChange={onFinancialChange} onPriceChange={onPriceChange} onNavigate={onNavigate} />}
            {activePath === '/admin/test-drives' && <TestDriveQueuePage requests={testDrives} onApprove={onApproveTestDrive} onDecline={onDeclineTestDrive} />}
            {activePath === '/admin/finance' && <FinancialPage cars={cars} onNavigate={onNavigate} />}
            {activePath === '/admin/featured' && <FeaturedPage cars={cars} featuredIds={featuredIds} onFeaturedChange={onFeaturedChange} />}
            {activePath === '/admin/new' && <CreateCarPage onAdd={onAdd} onDone={() => onNavigate('/admin/inventory')} />}
            {activePath === '/admin/edit' && (editingCar ? <EditCarPage key={editingCar.id} car={editingCar} onUpdate={onUpdate} onDone={() => onNavigate('/admin/inventory')} /> : <div className="admin-empty-state">This car could not be found. <button className="text-button" onClick={() => onNavigate('/admin/inventory')}>Return to inventory</button></div>)}
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewPage({ cars, featuredIds, testDrives, adminEmail, onNavigate, onStatusSelect }) {
  const pendingTestDrives = testDrives.filter((request) => request.status === 'pending').length;
  const statusCounts = cars.reduce((counts, car) => {
    const status = car.status || 'Available';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { Available: 0, Reserved: 0, Sold: 0 });

  return (
    <>
      <SectionHeading eyebrow="CATALOG CONTROL CENTER" title="Good to see you." description="A live view of inventory and customer appointments." action={<button className="primary-button" onClick={() => onNavigate('/admin/new')}><Plus size={16} /> Add a car</button>} />
      <section className="admin-account-card" aria-label="Administrator session">
        <ShieldCheck size={20} />
        <span><small>Signed in as</small><strong>{adminEmail || 'Administrator'}</strong><small>Secure session · password is never shown</small></span>
        <span className="admin-account-active">Active</span>
      </section>
      <div className="admin-metrics">
        <div className="admin-metric"><span>Live listings</span><strong>{cars.length}</strong><small>Vehicles in your inventory</small></div>
        <div className="admin-metric"><span>Featured cars</span><strong>{featuredIds.length}</strong><small>Shown in the home carousel</small></div>
        <button type="button" className="admin-metric inventory-metric pending-test-drives" onClick={() => onNavigate('/admin/test-drives')}><span>Pending test drives</span><strong>{pendingTestDrives}</strong><small>Review customer requests</small></button>
        {['Available', 'Reserved', 'Sold'].map((status) => <button type="button" className={`admin-metric inventory-metric status-${status.toLowerCase()}`} key={status} onClick={() => onStatusSelect(status)}><span>{status}</span><strong>{statusCounts[status]}</strong><small>View {status.toLowerCase()} cars</small></button>)}
      </div>
      <section className="admin-quick-actions">
        <div className="admin-section-heading"><div><div className="eyebrow muted">QUICK ACTIONS</div><h3>Where would you like to go?</h3></div></div>
        <div className="admin-action-list">
          <button onClick={() => onNavigate('/admin/inventory')}><CarFront size={19} /><span><strong>Manage inventory</strong><small>Review, update, or remove listings</small></span><ArrowRight size={17} /></button>
          <button onClick={() => onNavigate('/admin/test-drives')}><CalendarDays size={19} /><span><strong>Review test-drive requests</strong><small>Approve appointments in request order</small></span><ArrowRight size={17} /></button>
          <button onClick={() => onNavigate('/admin/finance')}><CircleDollarSign size={19} /><span><strong>View financial overview</strong><small>Review profit, pending balances, and sales</small></span><ArrowRight size={17} /></button>
          <button onClick={() => onNavigate('/admin/featured')}><Sparkles size={19} /><span><strong>Choose featured cars</strong><small>Curate the homepage carousel</small></span><ArrowRight size={17} /></button>
        </div>
      </section>
    </>
  );
}

function TestDriveQueuePage({ requests, onApprove, onDecline }) {
  const [approvedTimes, setApprovedTimes] = useState({});
  const pendingRequests = requests.filter((request) => request.status === 'pending').sort((a, b) => a.createdAt - b.createdAt);
  const reviewedRequests = requests.filter((request) => request.status !== 'pending').sort((a, b) => b.createdAt - a.createdAt);
  const formatDateTime = (value) => value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Not set';

  return <>
    <SectionHeading eyebrow="CUSTOMER REQUESTS" title="Test-drive queue" description={`${pendingRequests.length} pending request${pendingRequests.length === 1 ? '' : 's'}, ordered by when they arrived.`} />
    <section className="test-drive-queue">
      {pendingRequests.map((request, index) => <article className="test-drive-queue-item" key={request.id}>
        <div className="test-drive-queue-position">{index + 1}</div>
        <CarPhoto src={request.carImage} alt={`${request.carName} photo`} className="admin-vehicle-photo admin-queue-photo" />
        <div className="test-drive-queue-details">
          <div className="test-drive-queue-car"><strong>{request.carName}</strong><span>Preferred: {formatDateTime(request.preferredAt)}</span></div>
          <div className="test-drive-customer"><strong>{request.customerName}</strong><a href={`mailto:${request.customerEmail}`}>{request.customerEmail}</a>{request.customerPhone && <a href={`tel:${request.customerPhone}`}>{request.customerPhone}</a>}</div>
          <form className="test-drive-approval" onSubmit={(event) => { event.preventDefault(); const approvedAt = approvedTimes[request.id] ?? request.preferredAt; if (approvedAt) onApprove(request.id, approvedAt); }}>
            <label>Approved appointment time<input type="datetime-local" required value={approvedTimes[request.id] ?? request.preferredAt ?? ''} onChange={(event) => setApprovedTimes((current) => ({ ...current, [request.id]: event.target.value }))} /></label>
            <button className="primary-button" type="submit"><Check size={15} /> Approve</button>
            <button className="secondary-button" type="button" onClick={() => onDecline(request.id)}>Decline</button>
          </form>
        </div>
      </article>)}
      {pendingRequests.length === 0 && <div className="admin-empty-state">The test-drive queue is clear.</div>}
    </section>
    {reviewedRequests.length > 0 && <section className="test-drive-reviewed">
      <div className="admin-section-heading"><div><h3>Recently reviewed</h3><p>Appointment decisions and customer notifications.</p></div></div>
      {reviewedRequests.map((request) => <article className="test-drive-reviewed-row" key={request.id}>
        <CarPhoto src={request.carImage} alt={`${request.carName} photo`} className="admin-vehicle-photo admin-reviewed-photo" />
        <div><strong>{request.carName}</strong><small>{request.customerName} · {request.customerEmail}</small></div>
        <span className={`test-drive-status ${request.status}`}>{request.status === 'approved' ? 'Approved' : 'Declined'}</span>
        <time>{request.status === 'approved' ? formatDateTime(request.approvedAt) : formatDateTime(request.createdAt)}</time>
      </article>)}
    </section>}
  </>;
}

function FinancialPage({ cars, onNavigate }) {
  const currencies = [...new Set(cars.map((car) => car.currency || 'USD'))];
  const summaries = currencies.map((currency) => {
    const currencyCars = cars.filter((car) => (car.currency || 'USD') === currency);
    const recordedSales = currencyCars.filter((car) => car.status === 'Sold' && Number.isFinite(car.costBasis) && Number.isFinite(car.soldPrice));
    const realizedProfit = recordedSales.reduce((total, car) => total + car.soldPrice - car.costBasis, 0);
    const reservedCars = currencyCars.filter((car) => car.status === 'Reserved');
    const recordedPending = reservedCars.filter((car) => Number.isFinite(car.pendingAmount));
    const pendingMoney = recordedPending.reduce((total, car) => total + car.pendingAmount, 0);
    const soldCars = currencyCars.filter((car) => car.status === 'Sold' && Number.isFinite(car.soldPrice));
    const soldRevenue = soldCars.reduce((total, car) => total + car.soldPrice, 0);
    const availableCars = currencyCars.filter((car) => (car.status || 'Available') === 'Available' && Number.isFinite(car.price));
    const availableValue = availableCars.reduce((total, car) => total + car.price, 0);
    const pieItems = [
      { label: 'Pending money', value: pendingMoney, note: `${recordedPending.length} of ${reservedCars.length} reserved cars recorded`, tone: 'pending', color: '#c18d30' },
      { label: 'Sold revenue', value: soldRevenue, note: `${soldCars.length} sale prices recorded`, tone: 'revenue', color: '#318e82' },
      { label: 'Available stock', value: availableValue, note: 'Asking value of available listings', tone: 'stock', color: '#63869c' }
    ];
    const pieTotal = pieItems.reduce((total, item) => total + item.value, 0);
    let pieOffset = 0;
    const pieStops = pieItems.map((item) => {
      const start = pieOffset;
      pieOffset += pieTotal > 0 ? item.value / pieTotal * 100 : 0;
      return `${item.color} ${start}% ${pieOffset}%`;
    });
    return {
      currency,
      recordedSales,
      realizedProfit,
      pieItems,
      pieTotal,
      pieStyle: { background: pieTotal > 0 ? `conic-gradient(${pieStops.join(', ')})` : 'var(--surface-soft)' }
    };
  });

  return <>
    <SectionHeading eyebrow="MONEY OVERVIEW" title="Financial overview" description="Track realized profit, pending balances, sold revenue, and available stock." action={<button className="secondary-button" onClick={() => onNavigate('/admin/inventory')}><CarFront size={15} /> Update car amounts</button>} />
    {summaries.map(({ currency, recordedSales, realizedProfit, pieItems, pieTotal, pieStyle }) => <section className="admin-financial-picture" key={currency} aria-label={`${currency} financial breakdown`}>
      <div className="admin-financial-heading"><div><div className="eyebrow muted">FINANCIAL BREAKDOWN</div><h3>Portfolio breakdown · {currency}</h3></div><span>Amounts in {currency}</span></div>
      <div className="admin-pie-layout">
        <div className="admin-pie-chart" role="img" aria-label={pieItems.map((item) => `${item.label}: ${formatPrice(item.value, currency)}`).join('. ')} style={pieStyle} />
        <div className="admin-pie-legend">
          {pieItems.map((item) => <div className={`admin-pie-legend-row ${item.tone}`} key={item.label}>
            <span className="admin-pie-swatch" />
            <span className="admin-pie-legend-copy"><strong>{item.label}</strong><small>{item.note}</small></span>
            <strong className="admin-pie-value">{formatPrice(item.value, currency)}<small>{pieTotal > 0 ? `${(item.value / pieTotal * 100).toFixed(1)}%` : '0.0%'}</small></strong>
          </div>)}
        </div>
      </div>
      <div className="admin-realized-profit"><span><strong>Realized profit</strong><small>{recordedSales.length} complete sold-car records</small></span><strong>{formatPrice(realizedProfit, currency)}</strong></div>
    </section>)}
  </>;
}

function InventoryPage({ cars, carsLoading, carsError, onRetryCars, statusFilter, onStatusFilterChange, onRemove, onStatusChange, onFinancialChange, onPriceChange, onNavigate }) {
  const [query, setQuery] = useState('');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceDraft, setPriceDraft] = useState('');
  const [financialDrafts, setFinancialDrafts] = useState({});
  const filteredCars = cars.filter((car) => {
    const matchesStatus = statusFilter === 'All' || (car.status || 'Available') === statusFilter;
    const matchesQuery = `${car.name} ${car.model || ''} ${car.type} ${car.location || ''}`.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });
  const filterStatuses = ['All', 'Available', 'Reserved', 'Sold'];
  const beginPriceEdit = (car) => {
    setEditingPriceId(car.id);
    setPriceDraft(String(car.price));
  };
  const cancelPriceEdit = () => {
    setEditingPriceId(null);
    setPriceDraft('');
  };
  const savePrice = async (event, carId) => {
    event.preventDefault();
    const price = Number(priceDraft);
    if (!Number.isFinite(price) || price < 0) return;
    if (await onPriceChange(carId, price)) cancelPriceEdit();
  };
  const draftKey = (carId, field) => `${carId}:${field}`;
  const valueFor = (car, field) => financialDrafts[draftKey(car.id, field)] ?? car[field] ?? '';
  const saveFinancial = async (car, field) => {
    const key = draftKey(car.id, field);
    if (!(key in financialDrafts)) return;
    const draft = financialDrafts[key];
    const saved = await onFinancialChange(car.id, field, draft);
    if (saved) setFinancialDrafts((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  return (
    <>
      <SectionHeading eyebrow="YOUR CATALOG" title="Inventory" description={`Showing ${filteredCars.length} of ${cars.length} vehicles${statusFilter === 'All' ? '' : ` · ${statusFilter}`}.`} action={<button className="primary-button" onClick={() => onNavigate('/admin/new')}><Plus size={16} /> Add a car</button>} />
      {carsError ? <div className="admin-empty-state">{carsError}<button className="secondary-button" onClick={onRetryCars}>Retry</button></div> : carsLoading ? <div className="admin-empty-state">Loading inventory…</div> : <>
      <div className="admin-status-filters" role="group" aria-label="Filter inventory by status">{filterStatuses.map((status) => <button type="button" key={status} className={statusFilter === status ? 'selected' : ''} aria-pressed={statusFilter === status} onClick={() => onStatusFilterChange(status)}>{status}{status !== 'All' && <span>{cars.filter((car) => (car.status || 'Available') === status).length}</span>}</button>)}</div>
      <label className="admin-inventory-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your inventory" /></label>
      <div className="admin-inventory-list">
        {filteredCars.map((car) => (
          <article className="admin-inventory-row" key={car.id}>
            <CarPhoto src={car.image} alt={`${car.name} photo`} className="admin-vehicle-photo admin-inventory-photo" />
            <div className="admin-inventory-copy"><strong>{car.name}{car.model ? ` ${car.model}` : ''}</strong><span>{car.year} · {car.type} · {car.location}</span><button type="button" className="admin-price-edit" onClick={() => onNavigate(`/admin/edit/${car.id}`)}><Pencil size={13} /><span>Edit details</span></button></div>
            <div className="admin-price-editor">
              {editingPriceId === car.id ? <form className="admin-price-form" onSubmit={(event) => savePrice(event, car.id)}>
                <input type="number" min="0" step="1" aria-label={`New price for ${car.name}`} value={priceDraft} onChange={(event) => setPriceDraft(event.target.value)} autoFocus required />
                <button type="submit" className="admin-price-save" aria-label={`Save price for ${car.name}`}><Check size={14} /></button>
                <button type="button" className="admin-price-cancel" onClick={cancelPriceEdit} aria-label={`Cancel price edit for ${car.name}`}><X size={14} /></button>
              </form> : <>
                <strong className="admin-inventory-price">{formatPrice(car.price, car.currency)}</strong>
                <button type="button" className="admin-price-edit" onClick={() => beginPriceEdit(car)} aria-label={`Edit price for ${car.name}`}><Pencil size={13} /><span>Edit</span></button>
              </>}
            </div>
            <label className="admin-status-control"><span>Status</span><select aria-label={`Status for ${car.name}${car.model ? ` ${car.model}` : ''}`} value={car.status || 'Available'} onChange={(event) => onStatusChange(car.id, event.target.value)}><option>Available</option><option>Reserved</option><option>Sold</option></select></label>
            <button className="remove-button" onClick={() => onRemove(car.id)}><Trash2 size={14} /> Remove</button>
            <div className="admin-inventory-financials">
              <label>Cost basis<input type="number" min="0" step="1" aria-label={`Purchase cost for ${car.name}`} placeholder="Enter purchase cost" value={valueFor(car, 'costBasis')} onChange={(event) => setFinancialDrafts((current) => ({ ...current, [draftKey(car.id, 'costBasis')]: event.target.value }))} onBlur={() => saveFinancial(car, 'costBasis')} /></label>
              {car.status === 'Sold' && <>
                <label>Sold for<input type="number" min="0" step="1" aria-label={`Sale price for ${car.name}`} placeholder="Enter sale price" value={valueFor(car, 'soldPrice')} onChange={(event) => setFinancialDrafts((current) => ({ ...current, [draftKey(car.id, 'soldPrice')]: event.target.value }))} onBlur={() => saveFinancial(car, 'soldPrice')} /></label>
                <div className="admin-car-profit"><small>Profit</small><strong>{Number.isFinite(car.costBasis) && Number.isFinite(car.soldPrice) ? formatPrice(car.soldPrice - car.costBasis, car.currency) : 'Enter both figures'}</strong></div>
              </>}
              {car.status === 'Reserved' && <label>Money pending<input type="number" min="0" step="1" aria-label={`Remaining balance for ${car.name}`} placeholder="Remaining balance" value={valueFor(car, 'pendingAmount')} onChange={(event) => setFinancialDrafts((current) => ({ ...current, [draftKey(car.id, 'pendingAmount')]: event.target.value }))} onBlur={() => saveFinancial(car, 'pendingAmount')} /></label>}
            </div>
          </article>
        ))}
        {filteredCars.length === 0 && <div className="admin-empty-state">{cars.length === 0 ? 'Your inventory is empty. Add your first car to get started.' : statusFilter !== 'All' && !query ? `There are no ${statusFilter.toLowerCase()} cars right now.` : 'No listings match these filters.'}</div>}
      </div>
      </>}
    </>
  );
}

function FeaturedPage({ cars, featuredIds, onFeaturedChange }) {

  return (
    <>
      <SectionHeading eyebrow="HOMEPAGE CURATION" title="Featured cars" description="Choose the vehicles that appear in the homepage feature carousel." />
      <section className="admin-featured-section">
        <div className="admin-section-heading"><div><h3>Carousel selection</h3><p>{featuredIds.length} {featuredIds.length === 1 ? 'car' : 'cars'} selected</p></div></div>
        <div className="admin-featured-list">
          {cars.map((car) => (
            <label className="admin-featured-row" key={car.id}>
              <input type="checkbox" checked={featuredIds.includes(car.id)} onChange={() => onFeaturedChange(car.id, !car.isFeatured)} />
              <CarPhoto src={car.image} alt={`${car.name} photo`} className="admin-vehicle-photo admin-featured-photo" />
              <span><strong>{car.name}{car.model ? ` ${car.model}` : ''}</strong><small>{car.year} · {car.type}</small></span>
              <b>{formatPrice(car.price, car.currency)}</b>
            </label>
          ))}
          {cars.length === 0 && <div className="admin-empty-state">Add cars to your inventory before featuring them.</div>}
        </div>
      </section>
    </>
  );
}

const fallbackCarImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85';
const optionalNumber = (value) => value === '' ? null : Number(value);

function CarEditorForm({ car, onSave, onCancel, submitLabel }) {
  const [form, setForm] = useState(() => ({
    name: car?.name || '', model: car?.model || '', year: String(car?.year || 2024), type: car?.type || 'SUV', currency: car?.currency || 'USD',
    price: car?.price == null ? '' : String(car.price), costBasis: car?.costBasis == null ? '' : String(car.costBasis),
    soldPrice: car?.soldPrice == null ? '' : String(car.soldPrice), pendingAmount: car?.pendingAmount == null ? '' : String(car.pendingAmount),
    mileage: String(car?.mileage ?? ''), fuel: car?.fuel || 'Petrol', transmission: car?.transmission || 'Automatic',
    location: car?.location || 'DriveXCars showroom', description: car?.description || '',
    status: car?.status || 'Available', isFeatured: Boolean(car?.isFeatured)
  }));
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(car?.image || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (!imageFile) return undefined;
    const imageUrl = URL.createObjectURL(imageFile);
    setPreview(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageFile]);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Choose an image smaller than 10 MB.');
      event.target.value = '';
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Choose a JPEG, PNG, WebP, or GIF image.');
      event.target.value = '';
      return;
    }
    setError('');
    setImageFile(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);
    const saved = await onSave({
      name: form.name.trim(),
      model: form.model.trim() || null,
      year: Number(form.year),
      type: form.type,
      price: Number(form.price),
      currency: form.currency,
      costBasis: optionalNumber(form.costBasis),
      soldPrice: optionalNumber(form.soldPrice),
      pendingAmount: optionalNumber(form.pendingAmount),
      mileage: Number(form.mileage || 0),
      fuel: form.fuel,
      transmission: form.transmission,
      rating: car?.rating ?? null,
      location: form.location.trim() || 'DriveXCars showroom',
      image: car?.imagePath || fallbackCarImage,
      description: form.description.trim() || null,
      accent: car?.accent || null,
      status: form.status,
      isFeatured: form.isFeatured,
      imageFile
    });
    setIsSaving(false);
    if (saved) onCancel();
    else setError('The car could not be saved. Review the error message and try again.');
  };

  return <form className="admin-create-form" onSubmit={submit}>
    <div className="admin-form-section-title"><strong>Vehicle details</strong><span>Required fields marked *</span></div>
    <div className="form-row"><label>Make / brand *<input value={form.name} onChange={(event) => update('name', event.target.value)} required maxLength="80" /></label><label>Model<input value={form.model} onChange={(event) => update('model', event.target.value)} maxLength="120" /></label></div>
    <div className="form-row"><label>Year *<input type="number" min="1886" max="2100" value={form.year} onChange={(event) => update('year', event.target.value)} required /></label><label>Category *<select value={form.type} onChange={(event) => update('type', event.target.value)}>{['SUV', 'MPV', 'Sports', 'Electric', 'Sedan'].map((type) => <option key={type}>{type}</option>)}</select></label></div>
    <div className="form-row"><label>Mileage<input type="number" min="0" value={form.mileage} onChange={(event) => update('mileage', event.target.value)} /></label><label>Currency<select value={form.currency} onChange={(event) => update('currency', event.target.value)}><option value="USD">USD</option><option value="GBP">GBP</option></select></label></div>
    <div className="form-row"><label>Price *<span className="input-prefix"><span>{form.currency === 'GBP' ? '£' : '$'}</span><input type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => update('price', event.target.value)} required /></span></label><label>Purchase cost<span className="input-prefix"><span>{form.currency === 'GBP' ? '£' : '$'}</span><input type="number" min="0.01" step="0.01" value={form.costBasis} onChange={(event) => update('costBasis', event.target.value)} /></span></label></div>
    <div className="form-row"><label>Sold for<span className="input-prefix"><span>{form.currency === 'GBP' ? '£' : '$'}</span><input type="number" min="0.01" step="0.01" value={form.soldPrice} onChange={(event) => update('soldPrice', event.target.value)} /></span></label><label>Money pending<span className="input-prefix"><span>{form.currency === 'GBP' ? '£' : '$'}</span><input type="number" min="0" step="0.01" value={form.pendingAmount} onChange={(event) => update('pendingAmount', event.target.value)} /></span></label></div>
    <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Available</option><option>Reserved</option><option>Sold</option></select></label>
    <div className="form-row"><label>Fuel type<select value={form.fuel} onChange={(event) => update('fuel', event.target.value)}>{['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((fuel) => <option key={fuel}>{fuel}</option>)}</select></label><label>Transmission<select value={form.transmission} onChange={(event) => update('transmission', event.target.value)}><option>Automatic</option><option>Manual</option></select></label></div>
    <label>Location<input value={form.location} onChange={(event) => update('location', event.target.value)} maxLength="120" /></label>
    <label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows="4" /></label>
    <label>Vehicle image<div className="upload-box admin-upload-box">{preview ? <img src={preview} alt="Vehicle image preview" /> : <><div className="upload-icon"><Upload size={19} /></div><strong>Choose an image <span>to preview it here</span></strong><small>JPEG, PNG, WebP, or GIF · up to 10 MB</small></>}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImage} /></div></label>
    <label className="admin-feature-toggle"><input type="checkbox" checked={form.isFeatured} onChange={(event) => update('isFeatured', event.target.checked)} /> Feature this car on the homepage</label>
    {error && <span className="login-error" role="alert">{error}</span>}
    <div className="admin-form-actions"><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button><button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : submitLabel}</button></div>
  </form>;
}

function CreateCarPage({ onAdd, onDone }) {
  return <>
    <SectionHeading eyebrow="NEW LISTING" title="Add a car" description="Enter the vehicle details and publish it to your marketplace inventory." />
    <div className="admin-create-panel"><CarEditorForm onSave={onAdd} onCancel={onDone} submitLabel="Publish listing" /></div>
  </>;
}

function EditCarPage({ car, onUpdate, onDone }) {
  return <>
    <SectionHeading eyebrow="CATALOG UPDATE" title="Edit car" description={`Update the details for ${car.name}.`} />
    <div className="admin-create-panel"><CarEditorForm car={car} onSave={(payload) => onUpdate(car.id, payload)} onCancel={onDone} submitLabel="Save changes" /></div>
  </>;
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