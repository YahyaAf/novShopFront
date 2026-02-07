import { useState, useEffect } from 'react';
import promoService from '../services/promo.service';

export const usePromos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promoService.getAll();
      setPromos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des promos');
      console.error('Error fetching promos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return { promos, loading, error, refetch: fetchPromos };
};

export const usePromoMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPromo = async (promoData) => {
    try {
      setLoading(true);
      setError(null);
      await promoService.create(promoData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création du promo';
      setError(errorMessage);
      console.error('Error creating promo:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updatePromo = async (id, promoData) => {
    try {
      setLoading(true);
      setError(null);
      await promoService.update(id, promoData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du promo';
      setError(errorMessage);
      console.error('Error updating promo:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deletePromo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await promoService.delete(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression du promo';
      setError(errorMessage);
      console.error('Error deleting promo:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createPromo, updatePromo, deletePromo, loading, error };
};

export const usePromoValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const validateAndApply = async (code) => {
    try {
      setLoading(true);
      setError(null);
      const response = await promoService.validateAndApply(code);
      setResult(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Code promo invalide';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const checkValidity = async (code) => {
    try {
      setLoading(true);
      setError(null);
      const response = await promoService.checkValidity(code);
      setResult(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Code promo invalide';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { validateAndApply, checkValidity, loading, error, result };
};
