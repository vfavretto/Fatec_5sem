import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
};

export const cipherAPI = {
  encrypt: async (token, message, shift) => {
    const response = await api.post(
      '/cipher/encrypt',
      { message, shift },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  
  decrypt: async (token, encrypted, hash) => {
    const response = await api.post(
      '/cipher/decrypt',
      { encrypted, hash },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default api;

