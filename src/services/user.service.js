import api from '../config/api.config';

const userService = {
  getAll: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  getAllActive: async () => {
    const response = await api.get('/api/users/active');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  getByUsername: async (username) => {
    const response = await api.get(`/api/users/username/${username}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  softDelete: async (id) => {
    const response = await api.delete(`/api/users/${id}/soft`);
    return response.data;
  },

  hardDelete: async (id) => {
    const response = await api.delete(`/api/users/${id}/hard`);
    return response.data;
  },

  activate: async (id) => {
    const response = await api.patch(`/api/users/${id}/activate`);
    return response.data;
  },

  existsByUsername: async (username) => {
    const response = await api.get(`/api/users/exists/${username}`);
    return response.data;
  },

  count: async () => {
    const response = await api.get('/api/users/count');
    return response.data;
  },

  countActive: async () => {
    const response = await api.get('/api/users/count/active');
    return response.data;
  },
};

export default userService;
