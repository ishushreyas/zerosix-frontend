
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://secure-meggie-ishushreyas-4703d2bf.koyeb.app', // Assuming the backend is running on port 8000
});

export default {
  // Session
  sessionLogin(idToken) {
    return apiClient.post('/sessionLogin', { idToken });
  },

  logout() {
    return apiClient.post('/logout');
  },

  getProfile() {
    return apiClient.get('/profile');
  },

  getUserActivity() {
    return apiClient.get('/profile/activity');
  },

  getUsers() {
    return apiClient.get('/users');
  },

  updateUser(userId, userData) {
    return apiClient.put(`/users/${userId}`, userData);
  },

  uploadUserPhoto(userId, photo) {
    const formData = new FormData();
    formData.append('photo', photo);
    return apiClient.post(`/users/${userId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getSummary(month, year) {
      return apiClient.get('/summary', { params: { month, year } });
  },

  // Transactions
  getTransactions(month, year) {
    return apiClient.get('/transactions', { params: { month, year } });
  },

  getSingleTransaction(transactionId) {
    return apiClient.get(`/transactions/${transactionId}`);
  },

  addTransaction(transactionData) {
    return apiClient.post('/transactions', transactionData);
  },

  editTransaction(transactionId, transactionData) {
    return apiClient.put(`/transactions/${transactionId}`, transactionData);
  },

  deleteTransaction(transactionId) {
    return apiClient.delete(`/transactions/${transactionId}`);
  },

  softDeleteTransaction(transactionId) {
    return apiClient.delete(`/transactions/${transactionId}/soft-delete`);
  },

  // Stories
  getStories() {
    return apiClient.get('/stories');
  },

  createStoryWithMedia(media) {
    const formData = new FormData();
    formData.append('media', media);
    return apiClient.post('/stories/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  createStory(storyData) {
    return apiClient.post('/stories', storyData);
  },

  deleteStory(storyId) {
    return apiClient.delete(`/stories/${storyId}`);
  },

  likeStory(storyId) {
    return apiClient.post('/stories/like', { story_id: storyId });
  },

  getStoryLikes(storyId) {
    return apiClient.get(`/stories/${storyId}/likes`);
  },

  createReply(replyData) {
    return apiClient.post('/stories/reply', replyData);
  },

  getStoryReplies(storyId) {
    return apiClient.get(`/stories/${storyId}/replies`);
  },

  viewStory(storyId) {
    return apiClient.post(`/stories/${storyId}/view`);
  },

  // Notifications
  subscribeToNotifications(subscription) {
    return apiClient.post('/notifications/subscribe', subscription);
  },

  sendNotification(notification) {
    return apiClient.post('/notifications/send', notification);
  },

  // Storage
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getImages() {
    return apiClient.get('/images');
  },

  getImage(imageName) {
    return apiClient.get(`/image/${imageName}`);
  },
};
