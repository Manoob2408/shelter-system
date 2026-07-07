import axios from 'axios';
import { Animal, AnimalSummary, Stats } from '../types';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
);

export const animalService = {
  getAll: async (params?: { name?: string; species?: string; status?: string; breed?: string }) => {
    const res = await api.get<AnimalSummary[]>('/animals', { params });
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get<Animal>(`/animals/${id}`);
    return res.data;
  },

  create: async (animal: Omit<Animal, 'id'>) => {
    const res = await api.post<Animal>('/animals', animal);
    return res.data;
  },

  update: async (id: number, animal: Partial<Animal>) => {
    const res = await api.put<Animal>(`/animals/${id}`, animal);
    return res.data;
  },

  delete: async (id: number) => {
    await api.delete(`/animals/${id}`);
  },

  getStats: async () => {
    const res = await api.get<Stats>('/animals/stats');
    return res.data;
  }
};
