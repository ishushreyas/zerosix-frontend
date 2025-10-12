import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // TailwindCSS import

// Optional: Add Tailwind dark mode class on body
//document.documentElement.classList.add('dark'); // or remove for system preference

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);