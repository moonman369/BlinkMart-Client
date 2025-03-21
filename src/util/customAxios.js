import axios, { Axios } from "axios";
import { apiSummary } from "../config/api/apiSummary";

const customAxios = axios.create({
  baseURL: apiSummary.baseUrl,
  withCredentials: true,
});

// Sending accessToken in Auth header
customAxios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Generate new accessToken using refreshToken
customAxios.interceptors.request.use(
  (response) => response,
  async (error) => {
    let originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios({
      baseURL: apiSummary.baseUrl,
      withCredentials: true,
      url: apiSummary.endpoints.user.user.refreshToken.path,
      method: apiSummary.endpoints.user.refreshToken.method,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken } = response.data.tokens;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {}
};

export default customAxios;
