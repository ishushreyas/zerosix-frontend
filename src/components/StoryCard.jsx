import { useState } from 'react';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import api from '../api';

export default function StoryCard({ story }) {
  const [likes, setLikes] = useState(story.likes || 0);
  const [viewed, setViewed] = useState(false);

  const handleLike = async () => {
    try {
      await api.likeStory(story.id);
      setLikes(likes + 1);
    } catch (err) {
      console.error("Failed to like story", err);
    }
  };

  const handleView = async () => {
    if (!viewed) {
      try {
        await api.viewStory(story.id);
        setViewed(true);
      } catch (err) {
        console.error("Failed to mark story as viewed", err);
      }
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-md transition cursor-pointer"
      onClick={handleView}
    >
      {/* Optional media */}
      {story.mediaUrl && (
        <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={story.mediaUrl}
            alt="story media"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Story Content */}
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-gray-900 dark:text-gray-100">{story.title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{story.description}</div>
        <div className="text-xs text-gray-400 mt-1">{new Date(story.createdAt).toLocaleString()}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-2 text-gray-500 dark:text-gray-400">
        <button
          className="flex items-center gap-1 hover:text-red-500 transition"
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
        >
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{story.replies?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{story.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}