import axiosClient from './axiosClient';

const donorApi = {
  getAll: (params) => axiosClient.get('/donors', { params }),
  getById: (donorId) => axiosClient.get(`/donors/${donorId}`),
  getMe: () => axiosClient.get('/donors/me'),
  update: (donorId, payload) => axiosClient.put(`/donors/${donorId}`, payload),
  updateAvailability: (donorId, availability) => axiosClient.patch(`/donors/${donorId}/availability`, { availability }),
  remove: (donorId) => axiosClient.delete(`/donors/${donorId}`),
};

export default donorApi;
