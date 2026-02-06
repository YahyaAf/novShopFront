import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginOrCheckAuth = error.config?.url?.includes('/api/auth/me') || 
                                error.config?.url?.includes('/api/auth/login');
    
    if (error.response?.status === 401 && !isLoginOrCheckAuth) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    
    if (import.meta.env.DEV && !error.config?.url?.includes('/api/auth/me')) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
