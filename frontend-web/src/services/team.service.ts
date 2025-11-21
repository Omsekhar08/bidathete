import api from './api';

export const TeamService = {
  list: () => api.get('/teams').then(r => r.data),
  get: (id: string) => api.get(`/teams/${id}`).then(r => r.data),
  create: (payload: any) => api.post('/teams', payload).then(r => r.data),
  update: (id: string, payload: any) => api.put(`/teams/${id}`, payload).then(r => r.data),
  remove: (id: string) => api.delete(`/teams/${id}`).then(r => r.data),
  myTeam: () => api.get('/teams/my/team').then(r => r.data),
};