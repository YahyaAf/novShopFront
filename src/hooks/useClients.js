import { useState, useEffect } from 'react';
import clientService from '../services/client.service';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getAll();
      setClients(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, error, refetch: fetchClients };
};

export const useClientMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClient = async (clientData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.create(clientData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création du client';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.update(id, clientData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du client';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id, hard = false) => {
    try {
      setLoading(true);
      setError(null);
      if (hard) {
        await clientService.hardDelete(id);
      } else {
        await clientService.softDelete(id);
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression du client';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const assignUser = async (clientId, userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.assignUser(clientId, userId);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'assignation de l\'utilisateur';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createClient, updateClient, deleteClient, assignUser, loading, error };
};

export const useMyClientStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getMyStats();
      setStats(response.data);
      setIsClient(true);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404 || status === 500) {
        setIsClient(false);
        setError('Aucun profil client trouvé pour cet utilisateur');
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la récupération des statistiques');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, isClient, refetch: fetchStats };
};
