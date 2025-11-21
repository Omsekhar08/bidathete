import axios from 'axios';
const API = axios.create({ baseURL: process.env.API_URL || 'http://localhost:3000/api' });

export const NotificationService = {
  send: (token: string, payload: any) =>
    API.post('/notifications/send', payload, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),

  list: (token: string) =>
    API.get('/notifications', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
};

export default NotificationService;