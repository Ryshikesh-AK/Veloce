import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/App.jsx';

registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(<App />);