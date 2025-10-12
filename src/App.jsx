import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Feed from './pages/Feed';
import Expenses from './pages/Expenses';
import Chat from './pages/Chat';

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mq.matches ? 'dark' : 'light');
    const listener = e => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  return (
    <Router>
      <div className={`min-h-screen p-6 transition-colors duration-500 ${theme==='dark'?'bg-gray-900 text-white':'bg-gray-50 text-gray-900'}`}>
        <Header theme={theme} setTheme={setTheme} />
        <div className="mb-16">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}