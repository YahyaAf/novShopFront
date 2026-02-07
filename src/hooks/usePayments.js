import { useState, useEffect } from 'react';
import paymentService from '../services/payment.service';

export const usePaymentsByCommande = (commandeId) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    if (!commandeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getByCommande(commandeId);
      setPayments(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des paiements');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [commandeId]);

  return { payments, loading, error, refetch: fetchPayments };
};

export const usePaymentSummary = (commandeId) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    if (!commandeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getPaymentSummary(commandeId);
      setSummary(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du résumé');
      console.error('Error fetching payment summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [commandeId]);

  return { summary, loading, error, refetch: fetchSummary };
};

export const usePaymentMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.create(paymentData);
      return { success: true, data: response.data, message: response.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création du paiement';
      setError(errorMessage);
      console.error('Error creating payment:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading, error };
};
