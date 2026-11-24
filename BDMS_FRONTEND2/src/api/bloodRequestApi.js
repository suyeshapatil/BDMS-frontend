import axiosClient from './axiosClient';

const bloodRequestApi = {
  create: (payload) => axiosClient.post('/blood-requests', payload),
  getAll: () => axiosClient.get('/blood-requests'),
  getById: (requestId) => axiosClient.get(`/blood-requests/${requestId}`),
  getByHospital: (hospitalId) => axiosClient.get(`/blood-requests/hospital/${hospitalId}`),
  getMatchingMe: () => axiosClient.get('/blood-requests/matching-me'),
  updateStatus: (requestId, requestStatus) => axiosClient.patch(`/blood-requests/${requestId}/status`, { requestStatus }),
  remove: (requestId) => axiosClient.delete(`/blood-requests/${requestId}`),
};

export default bloodRequestApi;
