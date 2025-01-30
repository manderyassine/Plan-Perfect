import axios from 'axios';
import api from '../utils/api';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => {
    console.log('Register Request:', userData);
    return api.post('/auth/register', userData);
  },
  login: (credentials) => {
    console.log('Login Request:', credentials);
    return api.post('/auth/login', credentials);
  },
  updateProfile: (profileData) => {
    console.log('Profile Update Request:', profileData);
    return api.put('/auth/profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  verifyToken: () => api.get('/auth/verify')
};

export const tasks = {
  getAll: () => api.get('/tasks'),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.patch(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;
