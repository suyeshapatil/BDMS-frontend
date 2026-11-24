import axiosClient from './axiosClient';

const donationHistoryApi = {
  record: (payload) => axiosClient.post('/donation-history', payload),
  getAll: () => axiosClient.get('/donation-history'),
  getByDonor: (donorId) => axiosClient.get(`/donation-history/donor/${donorId}`),
  getByHospital: (hospitalId) => axiosClient.get(`/donation-history/hospital/${hospitalId}`),
};

export default donationHistoryApi;
