import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://book-review-platform-no15.onrender.com';

console.log('🌐 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - Render server might be sleeping');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - Check internet connection');
    } else if (error.response?.status === 401) {
      console.error('🔒 Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;