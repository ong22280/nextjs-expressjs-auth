import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Create an Axios instance with default options
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Get token from local storage
export function getToken() {
  try {
    const token = JSON.parse(localStorage.getItem("authToken") || "").token;
    return token || null;
  } catch (e) {
    console.error("Failed to parse auth object from local storage:", e);
    return null;
  }
}

// Add a request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    // If token is available, set Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
