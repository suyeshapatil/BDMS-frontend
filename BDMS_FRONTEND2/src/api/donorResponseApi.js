import axiosClient from './axiosClient';

const donorResponseApi = {
  accept: (requestId) => axiosClient.post('/donor-responses/accept', { requestId }),
  reject: (requestId) => axiosClient.post('/donor-responses/reject', { requestId }),
  updateStatus: (responseId, responseStatus) => axiosClient.patch(`/donor-responses/${responseId}/status`, { responseStatus }),
  getByDonor: (donorId) => axiosClient.get(`/donor-responses/donor/${donorId}`),
  getByRequest: (requestId) => axiosClient.get(`/donor-responses/request/${requestId}`),
};

export default donorResponseApi;
