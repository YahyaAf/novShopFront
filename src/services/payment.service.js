import api from '../config/api.config';

const paymentService = {
  async create(paymentData) {
    const response = await api.post('/api/payments', paymentData);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/payments/${id}`);
    return response.data;
  },

  async getByCommande(commandeId) {
    const response = await api.get(`/api/payments/commande/${commandeId}`);
    return response.data;
  },

  async getPaymentSummary(commandeId) {
    const response = await api.get(`/api/payments/commande/${commandeId}/summary`);
    return response.data;
  }
};

export default paymentService;
