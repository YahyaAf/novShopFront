import { useState, useEffect } from 'react';
import userService from '../services/user.service';

export const useUsers = (fetchOnMount = true) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchUsers();
    }
  }, [fetchOnMount]);

  return { users, loading, error, refetch: fetchUsers };
};

export const useUserMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.create(userData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la création';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.update(id, userData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la modification';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, hard = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = hard 
        ? await userService.hardDelete(id)
        : await userService.softDelete(id);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la suppression';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.activate(id);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de l\'activation';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createUser, updateUser, deleteUser, activateUser };
};
