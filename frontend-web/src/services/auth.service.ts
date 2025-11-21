import api, { setAuthToken } from './api';

export const AuthService = {
  login: (payload: any) => api.post('/auth/login', payload).then(r => r.data),
  register: (payload: any) => api.post('/auth/register', payload).then(r => r.data),
  refresh: (token: string) => api.post('/auth/refresh', { refreshToken: token }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  setToken: setAuthToken,
};

export default AuthService;