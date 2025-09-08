import axios from 'axios';
const api = axios.create({
  baseURL: process.env.API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
