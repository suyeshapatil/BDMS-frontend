import axiosClient from "./axiosClient";

const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload),

  login: (payload) => axiosClient.post("/auth/login", payload),

  refreshToken: (refreshToken) =>
    axiosClient.post("/auth/refresh-token", {
      refreshToken,
    }),

  forgotPassword: (email) =>
    axiosClient.post("/auth/forgot-password", {
      email,
    }),

  resetPassword: (payload) => axiosClient.post("/auth/reset-password", payload),

  changePassword: (payload) =>
    axiosClient.post("/auth/change-password", payload),
};

export default authApi;
