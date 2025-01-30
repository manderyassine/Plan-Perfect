import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('API Request Interceptor:', {
      url: config.url,
      method: config.method,
      token: token ? 'Present' : 'Missing'
    });

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });

    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          // Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403: // Forbidden
          console.warn('Access forbidden');
          break;
        case 404: // Not Found
          console.warn('Resource not found');
          break;
        case 500: // Internal Server Error
          console.error('Server error');
          break;
      }
    }

    return Promise.reject(error);
  }
);

// Separate method for multipart form data
export const apiMultipart = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Add a request interceptor to include the token for multipart requests
apiMultipart.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Multipart API Request - Token:', token ? 'Present' : 'Not Found');
    console.log('Multipart API Request - URL:', config.url);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Multipart API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

export default api;
