import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDatabase } from './db/database'

// Add theme-toggle-transition class to body for smooth theme transitions
document.body.classList.add('theme-toggle-transition');

// Initialize the database
initializeDatabase().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

createRoot(document.getElementById("root")!).render(<App />);
