import { Sun, Moon } from 'lucide-react';

export default function Header({ theme, setTheme }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl">💸</div>
        <div className="font-semibold text-lg">Expense Manager</div>
      </div>
      <button
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  );
}