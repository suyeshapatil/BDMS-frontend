import axiosClient from './axiosClient';

const adminUserApi = {
  getAll: () => axiosClient.get('/admin/users'),
  getById: (userId) => axiosClient.get(`/admin/users/${userId}`),
  deactivate: (userId) => axiosClient.patch(`/admin/users/${userId}/deactivate`),
  activate: (userId) => axiosClient.patch(`/admin/users/${userId}/activate`),
  remove: (userId) => axiosClient.delete(`/admin/users/${userId}`),
};

export default adminUserApi;
