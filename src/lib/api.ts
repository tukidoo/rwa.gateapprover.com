import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/constants/env";
import { cookieManager } from "@/lib/cookies";

// Custom Axios instance with common configurations
const api: AxiosInstance = axios.create({
  baseURL: env.backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authentication token from cookies
api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};

    // Get token from cookies
    const token = cookieManager.getToken();

    if (token && !config.headers.Authorization) {
      const authToken = `Bearer ${token}`;
      config.headers.Authorization = authToken;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor to standardize response format
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error("[API Response error]", error?.response?.data);
    return Promise.reject(error?.response?.data);
  }
);

export { api };
