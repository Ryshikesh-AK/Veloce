import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('pwa_count')
    return saved ? parseInt(saved, 10) : 0
  })

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [swActive, setSwActive] = useState(false)

  useEffect(() => {
    localStorage.setItem('pwa_count', count.toString())
  }, [count])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        setSwActive(registrations.length > 0)
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="pwa-container">
      <div className={`badge ${isOnline ? 'online' : 'offline'}`}>
        <span className="status-dot"></span>
        {isOnline ? 'Network Online' : 'Offline Mode Active'}
      </div>

      <div className="logo-section">
        <img src="/pwa-192x192.svg" alt="PWA Icon" className="app-icon" />
      </div>

      <h1>React PWA App</h1>
      <p className="subtitle">
        Progressive Web Application with Service Worker & Offline Capability
      </p>

      <div className="card">
        <button
          type="button"
          className="counter-btn"
          onClick={() => setCount((prev) => prev + 1)}
        >
          Count is {count} (Saved locally)
        </button>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <div className="info-label">Service Worker</div>
          <div className="info-value">
            {'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}
          </div>
        </div>

        <div className="info-item">
          <div className="info-label">PWA Mode</div>
          <div className="info-value">
            {window.matchMedia('(display-mode: standalone)').matches
              ? 'Standalone App'
              : 'Web Browser'}
          </div>
        </div>
      </div>

      <footer>
        Built with React, Vite & PWA Service Worker
      </footer>
    </div>
  )
}

export default App

