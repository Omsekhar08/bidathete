import api from './api';

export const AuctionService = {
  list: () => api.get('/auctions').then(r => r.data),
  get: (id: string) => api.get(`/auctions/${id}`).then(r => r.data),
  create: (payload: any) => api.post('/auctions', payload).then(r => r.data),
  update: (id: string, payload: any) => api.put(`/auctions/${id}`, payload).then(r => r.data),
  start: (id: string) => api.post(`/auctions/${id}/start`).then(r => r.data),
  end: (id: string) => api.post(`/auctions/${id}/end`).then(r => r.data),
  live: (id: string) => api.get(`/auctions/${id}/live`).then(r => r.data),
};