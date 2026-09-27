import React, { useState } from 'react';
import { ArrowRight, CarFront } from 'lucide-react';
import { carApi } from '../../shared/api.js';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await carApi.login(email, password);
      onLogin();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="admin-login-page"><div className="admin-login-card"><div className="brand admin-login-brand"><div className="brand-mark"><CarFront size={20} strokeWidth={2.5} /></div><span>veloce<span className="brand-dot">.</span></span></div><div className="eyebrow muted">RESTRICTED AREA</div><h1>Admin sign in</h1><p>Authorized Veloce team members only. Your session stays on this device until you sign out.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} required autoComplete="username" /></label><label>Password<input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} placeholder="Enter admin password" required autoComplete="current-password" /></label>{error && <span className="login-error" role="alert">{error}</span>}<button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Continue securely'} <ArrowRight size={16} /></button></form><a href="/">Return to marketplace</a></div></main>;
}