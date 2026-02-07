import api from '../config/api.config';

const promoService = {
  async create(promoData) {
    const response = await api.post('/api/promos', promoData);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/api/promos');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/promos/${id}`);
    return response.data;
  },

  async update(id, promoData) {
    const response = await api.put(`/api/promos/${id}`, promoData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/api/promos/${id}`);
    return response.data;
  },

  async validateAndApply(code) {
    const response = await api.post('/api/promos/apply', null, {
      params: { code }
    });
    return response.data;
  },

  async checkValidity(code) {
    const response = await api.get('/api/promos/check', {
      params: { code }
    });
    return response.data;
  }
};

export default promoService;
