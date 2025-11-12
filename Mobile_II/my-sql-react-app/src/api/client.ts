import axios from 'axios';

const baseURL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || 'http://localhost:3333';

export const api = axios.create({
  baseURL
});

