import { Newspaper, Wallet, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = [
    { name: 'Feed', icon: <Newspaper className="h-5 w-5" />, path: '/' },
    { name: 'Expenses', icon: <Wallet className="h-5 w-5" />, path: '/expenses' },
    { name: 'Chat', icon: <MessageCircle className="h-5 w-5" />, path: '/chat' },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-3 mx-auto max-w-md px-4">
      <div className="grid grid-cols-3 gap-2 rounded-3xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-2">
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition ${
                active
                  ? 'bg-white dark:bg-gray-700 text-black dark:text-white'
                  : 'hover:bg-white/10 dark:hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              <span className="text-xs">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}