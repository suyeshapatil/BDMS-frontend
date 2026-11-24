import axiosClient from './axiosClient';

const hospitalApi = {
  getAll: () => axiosClient.get('/hospitals'),
  getVerified: () => axiosClient.get('/hospitals/verified'),
  getById: (hospitalId) => axiosClient.get(`/hospitals/${hospitalId}`),
  getMe: () => axiosClient.get('/hospitals/me'),
  update: (hospitalId, payload) => axiosClient.put(`/hospitals/${hospitalId}`, payload),
  remove: (hospitalId) => axiosClient.delete(`/hospitals/${hospitalId}`),
};

export default hospitalApi;
