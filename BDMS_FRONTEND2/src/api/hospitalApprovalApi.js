import axiosClient from './axiosClient';

const hospitalApprovalApi = {
  process: (payload) => axiosClient.post('/hospital-approvals', payload),
  getAll: () => axiosClient.get('/hospital-approvals'),
  getByHospital: (hospitalId) => axiosClient.get(`/hospital-approvals/hospital/${hospitalId}`),
};

export default hospitalApprovalApi;
