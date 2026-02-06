import api from '../config/api.config';

const clientService = {
  async create(clientData) {
    const response = await api.post('/api/clients', clientData);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/api/clients');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/clients/${id}`);
    return response.data;
  },

  async update(id, clientData) {
    const response = await api.put(`/api/clients/${id}`, clientData);
    return response.data;
  },

  async softDelete(id) {
    const response = await api.patch(`/api/clients/${id}/deactivate`);
    return response.data;
  },

  async hardDelete(id) {
    const response = await api.delete(`/api/clients/${id}`);
    return response.data;
  },

  async assignUser(clientId, userId) {
    const response = await api.patch(`/api/clients/${clientId}/assign-user/${userId}`);
    return response.data;
  },

  async count() {
    const response = await api.get('/api/clients/count');
    return response.data;
  },

  async getMyStats() {
    const response = await api.get('/api/clients/me/stats');
    return response.data;
  }
};

export default clientService;
