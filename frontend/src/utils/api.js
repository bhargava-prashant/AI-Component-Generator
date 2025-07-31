import axios from 'axios';

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // if (process.env.NODE_ENV === 'production') {
  //   return 'https://ai-component-generator-0akk.onrender.com/api';
  // }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,  // Essential for sending cookies
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('🚪 Authentication failed - user may need to login again');
      // You can dispatch a logout action here if needed
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
