import axiosClient from './axiosClient';

const notificationApi = {
  create: (payload) => axiosClient.post('/notifications', payload),
  getMine: () => axiosClient.get('/notifications/me'),
  getMineUnread: () => axiosClient.get('/notifications/me/unread'),
  markAsRead: (notificationId) => axiosClient.patch(`/notifications/${notificationId}/read`),
  remove: (notificationId) => axiosClient.delete(`/notifications/${notificationId}`),
};

export default notificationApi;
