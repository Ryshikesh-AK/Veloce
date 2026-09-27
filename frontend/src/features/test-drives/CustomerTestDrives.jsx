import React, { useEffect, useState } from 'react';
import { ArrowRight, Bell, CalendarDays, X } from 'lucide-react';
import { formatDateTime, getLocalDateTimeValue } from './storage.js';

export function MyTestDrivesPage({ requests, email, onEmailChange, onBrowse }) {
  const [emailDraft, setEmailDraft] = useState(email);
  useEffect(() => setEmailDraft(email), [email]);
  const normalizedEmail = email.trim().toLowerCase();
  const customerRequests = requests.filter((request) => request.customerEmail === normalizedEmail).sort((a, b) => b.createdAt - a.createdAt);
  const pendingRequests = requests.filter((request) => request.status === 'pending').sort((a, b) => a.createdAt - b.createdAt);

  return <section className="test-drive-customer-page">
    <div className="section-head"><div><div className="eyebrow muted">APPOINTMENTS</div><h2>Your <em>test drives.</em></h2></div><button className="text-button" onClick={onBrowse}>Browse cars <ArrowRight size={16} /></button></div>
    <form className="test-drive-lookup" onSubmit={(event) => { event.preventDefault(); onEmailChange(emailDraft); }}>
      <label htmlFor="test-drive-email">Email used for your request</label>
      <input id="test-drive-email" type="email" value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} placeholder="you@example.com" required />
      <button type="submit" className="secondary-button">Find my requests</button>
    </form>
    <div className="test-drive-customer-list">
      {customerRequests.map((request) => {
        const queuePosition = pendingRequests.findIndex((pending) => pending.id === request.id) + 1;
        return <article className={`test-drive-customer-card ${request.status}`} key={request.id}>
          <img src={request.carImage} alt={request.carName} />
          <div className="test-drive-customer-card-copy">
            <div className="test-drive-customer-card-heading"><h3>{request.carName}</h3><span className={`test-drive-status ${request.status}`}>{request.status === 'approved' ? 'Approved' : request.status === 'declined' ? 'Declined' : 'Pending'}</span></div>
            {request.status === 'approved' ? <div className="test-drive-user-notice"><Bell size={17} /><span><strong>Your test drive is approved</strong><small>{formatDateTime(request.approvedAt)}</small></span></div> : request.status === 'pending' ? <p>Request received. You are #{queuePosition} in the approval queue. Preferred time: {formatDateTime(request.preferredAt)}.</p> : <p>This request was declined. Contact the showroom to find another time.</p>}
          </div>
        </article>;
      })}
      {customerRequests.length === 0 && <div className="empty-state"><CalendarDays size={25} /><h3>{normalizedEmail ? 'No test-drive requests found' : 'Check your test drives'}</h3><p>{normalizedEmail ? 'Enter the email address used when requesting a test drive.' : 'Enter your email address above to see requests and approval updates.'}</p></div>}
    </div>
  </section>;
}

export function TestDriveRequestModal({ car, defaultEmail, onClose, onSubmit }) {
  const [form, setForm] = useState(() => {
    const preferredDate = new Date();
    preferredDate.setDate(preferredDate.getDate() + 1);
    preferredDate.setHours(10, 0, 0, 0);
    return { customerName: '', customerEmail: defaultEmail, customerPhone: '', preferredAt: getLocalDateTimeValue(preferredDate) };
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const minimumDateTime = getLocalDateTimeValue(new Date());

  return <div className="modal-backdrop signup-backdrop" onClick={onClose}><section className="test-drive-modal" role="dialog" aria-modal="true" aria-labelledby="test-drive-modal-title" onClick={(event) => event.stopPropagation()}>
    <button className="close-button signup-close" onClick={onClose} aria-label="Close test-drive request"><X size={19} /></button>
    <div className="signup-mark"><CalendarDays size={19} /></div>
    <div className="eyebrow muted">TEST-DRIVE REQUEST</div>
    <h2 id="test-drive-modal-title">Take the {car.name}<br /><em>for a drive.</em></h2>
    <p>Choose a preferred time. Our team will review the request and confirm an appointment.</p>
    <form onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, carId: car.id, carName: `${car.name}${car.model ? ` ${car.model}` : ''}`, carImage: car.image }); }}>
      <label>Your name<input value={form.customerName} onChange={(event) => update('customerName', event.target.value)} placeholder="Jordan Miller" required /></label>
      <label>Email address<input type="email" value={form.customerEmail} onChange={(event) => update('customerEmail', event.target.value)} placeholder="you@example.com" required /></label>
      <label>Phone number<input type="tel" value={form.customerPhone} onChange={(event) => update('customerPhone', event.target.value)} placeholder="+1 555 000 0000" /></label>
      <label>Preferred date and time<input type="datetime-local" min={minimumDateTime} value={form.preferredAt} onChange={(event) => update('preferredAt', event.target.value)} required /></label>
      <button className="primary-button" type="submit"><CalendarDays size={15} /> Request test drive</button>
    </form>
  </section></div>;
}