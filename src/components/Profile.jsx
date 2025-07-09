import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setProfile(response.data);
        setDisplayName(response.data.displayName);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await api.updateUser(user.uid, { displayName });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      await api.uploadUserPhoto(user.uid, selectedFile);
      const response = await api.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to upload photo", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Account Information</h2>

        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              (displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()
            )}
          </div>
          <div>
            <p className="text-lg font-semibold">{displayName || 'No display name'}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="photo">Profile Picture</label>
          <input
            id="photo"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700"
          />
          <button
            onClick={handleFileUpload}
            disabled={!selectedFile}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;