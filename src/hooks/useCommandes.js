import { useState, useEffect } from 'react';
import commandeService from '../services/commande.service';

export const useCommandes = (filters = {}) => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (filters.clientId) {
        response = await commandeService.getByClient(filters.clientId);
      } else if (filters.status) {
        response = await commandeService.getByStatus(filters.status);
      } else {
        response = await commandeService.getAll();
      }
      
      setCommandes(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des commandes');
      console.error('Error fetching commandes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, [filters.clientId, filters.status]);

  return { commandes, loading, error, refetch: fetchCommandes };
};

export const useCommandeMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCommande = async (commandeData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await commandeService.create(commandeData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de la commande';
      setError(errorMessage);
      console.error('Error creating commande:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const confirmCommande = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await commandeService.confirm(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la confirmation de la commande';
      setError(errorMessage);
      console.error('Error confirming commande:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const cancelCommande = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await commandeService.cancel(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'annulation de la commande';
      setError(errorMessage);
      console.error('Error canceling commande:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createCommande, confirmCommande, cancelCommande, loading, error };
};

export const useCommandeDetails = (id) => {
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommande = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await commandeService.getById(id);
      setCommande(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement de la commande');
      console.error('Error fetching commande:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommande();
  }, [id]);

  return { commande, loading, error, refetch: fetchCommande };
};
