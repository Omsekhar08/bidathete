import axios from 'axios';
const API = axios.create({ baseURL: process.env.API_URL || 'http://localhost:3000/api' });

export const AuthService = {
  login: (credentials: any) => API.post('/auth/login', credentials).then(r => r.data),
  register: (payload: any) => API.post('/auth/register', payload).then(r => r.data),
  me: (token: string) => API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
};