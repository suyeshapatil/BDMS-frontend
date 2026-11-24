import axiosClient from './axiosClient';

const reportApi = {
  generate: (reportName) => axiosClient.post('/reports', { reportName }),
  getAll: () => axiosClient.get('/reports'),
};

export default reportApi;
