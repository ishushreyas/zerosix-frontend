import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
      setStories(response.data || []); // Assuming response.data is an array of stories
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
      await api.createStory({ content: newStoryContent }); // Assuming backend expects { content: string }
      setNewStoryContent('');
      fetchStories(); // Re-fetch stories after adding
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
      fetchStories(); // Re-fetch stories to update like count
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

      {/* Create New Story Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newStoryContent">What's on your mind?</Label>
              <Input
                id="newStoryContent"
                name="newStoryContent"
                value={newStoryContent}
                onChange={(e) => setNewStoryContent(e.target.value)}
                placeholder="Share your thoughts..."
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Post
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stories Feed */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <p className="text-gray-600">No posts found. Be the first to share something!</p>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div key={story.id} className="border p-4 rounded-lg shadow-sm bg-white">
                  <p className="text-gray-800 text-lg mb-2">{story.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Posted by: {story.user_id || 'Anonymous'}</span> {/* Assuming story has user_id */}
                    <span>{new Date(story.created_at).toLocaleString()}</span> {/* Assuming story has created_at */}
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleLikeStory(story.id)}>
                      ❤️ {story.likes || 0} {/* Assuming story has a likes count */}
                    </Button>
                    {/* Add reply button/functionality here if needed */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Updates;
