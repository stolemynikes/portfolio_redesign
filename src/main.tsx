// No StrictMode: double-mounted effects would re-split headings and
// duplicate ScrollTriggers in dev.
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './styles/backdrop.css';
import './styles/sections.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
