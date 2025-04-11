import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add theme-toggle-transition class to body for smooth theme transitions
document.body.classList.add('theme-toggle-transition');

createRoot(document.getElementById("root")!).render(<App />);
