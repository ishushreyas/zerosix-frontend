import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchModal from '../components/SearchModal';
import api from '../api';
import StoryCard from '../components/StoryCard';

export default function Feed() {
  const [showSearch, setShowSearch] = useState(false);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.getStories().then(res => setStories(res.data));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
        >
          <Search className="h-5 w-5 text-gray-400" />
          <span className="text-gray-400">Search transactions or stories...</span>
        </button>
      </div>

      <div className="space-y-4">
        {stories.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No stories yet</div>
        ) : (
          stories.map(story => <StoryCard key={story.id} story={story} />)
        )}
      </div>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}