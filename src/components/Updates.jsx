import React, { useState, useEffect } from 'react';
import api from '../api';

const Updates = () => {
  const [stories, setStories] = useState([]);
  const [newStoryContent, setNewStoryContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.getStories();
      setStories(response.data || []);
    } catch (err) {
      setError('Failed to fetch stories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!newStoryContent.trim()) return;

    try {
      setLoading(true);
      await api.createStory({ content: newStoryContent });
      setNewStoryContent('');
      fetchStories();
    } catch (err) {
      setError('Failed to create story.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeStory = async (storyId) => {
    try {
      await api.likeStory(storyId);
      fetchStories();
    } catch (err) {
      setError('Failed to like story.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading updates...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Social Feed</h1>

      {/* New Story Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleAddStory} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="newStoryContent" className="block text-gray-700 font-medium">
              What's on your mind?
            </label>
            <input
              id="newStoryContent"
              name="newStoryContent"
              value={newStoryContent}
              onChange={(e) => setNewStoryContent(e.target.value)}
              placeholder="Share your thoughts..."
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Post
          </button>
        </form>
      </div>

      {/* Stories Feed */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
        {stories.length === 0 ? (
          <p className="text-gray-600">No posts found. Be the first to share something!</p>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div key={story.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="text-gray-800 text-lg mb-2">{story.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Posted by: {story.user_id || 'Anonymous'}</span>
                  <span>{new Date(story.created_at).toLocaleString()}</span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => handleLikeStory(story.id)}
                    className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    ❤️ {story.likes || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Updates;