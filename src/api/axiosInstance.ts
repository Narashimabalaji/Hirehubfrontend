import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      try {
        const response = await axios.post(`${baseURL}/refresh`, {
          refreshToken,
        });

        const newToken = response.data.access_token;
        if (newToken) {
          localStorage.setItem('access_token', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Token refresh failed", err);
        // You may want to log out user here
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
