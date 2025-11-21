import api from './api';

export const NotificationService = {
  send: (payload: any) => api.post('/notifications/send', payload).then(r => r.data),
  list: () => api.get('/notifications').then(r => r.data),
};
export default NotificationService;