import api from '../config/api.config';

const commandeService = {
  async create(commandeData) {
    const response = await api.post('/api/commandes', commandeData);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/api/commandes', {
      params: {
        min: 0,
        size: 1000
      }
    });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/commandes/${id}`);
    return response.data;
  },

  async getByClient(clientId) {
    const response = await api.get(`/api/commandes/client/${clientId}`);
    return response.data;
  },

  async getByStatus(status) {
    const response = await api.get(`/api/commandes/status/${status}`);
    return response.data;
  },

  async confirm(id) {
    const response = await api.put(`/api/commandes/${id}/confirm`);
    return response.data;
  },

  async cancel(id) {
    const response = await api.put(`/api/commandes/${id}/cancel`);
    return response.data;
  }
};

export default commandeService;
