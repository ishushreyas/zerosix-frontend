import { useState } from 'react';
import { Search } from 'lucide-react';
import SearchModal from '../components/SearchModal';

export default function Feed() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <button
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
        >
          <Search className="h-5 w-5 text-gray-400" />
          <span className="text-gray-400">Search transactions or rooms...</span>
        </button>
      </div>

      {/* Placeholder Feed Content */}
      <div className="text-center text-gray-500 py-20">
        Welcome to your Feed! Use the search bar above to find transactions or rooms.
      </div>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}
