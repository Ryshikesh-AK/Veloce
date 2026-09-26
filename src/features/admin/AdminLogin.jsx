import React, { useState } from 'react';
import { ArrowRight, CarFront } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (password !== 'veloce-admin') {
      setError('Incorrect admin password.');
      return;
    }
    onLogin();
  };

  return <main className="admin-login-page"><div className="admin-login-card"><div className="brand admin-login-brand"><div className="brand-mark"><CarFront size={20} strokeWidth={2.5} /></div><span>veloce<span className="brand-dot">.</span></span></div><div className="eyebrow muted">RESTRICTED AREA</div><h1>Admin sign in</h1><p>Authorized Veloce team members only. Your session stays on this device until you sign out.</p><form onSubmit={submit}><label>Password<input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} placeholder="Enter admin password" autoFocus /></label>{error && <span className="login-error">{error}</span>}<button className="primary-button" type="submit">Continue securely <ArrowRight size={16} /></button></form><a href="/">Return to marketplace</a></div></main>;
}