import { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      setUser(response.data);
      setError(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(username, password);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      let errorMsg = 'Erreur de connexion';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMsg = err.response.data?.message || 'Username ou password incorrect';
        } else if (err.response.status === 401) {
          errorMsg = 'Identifiants incorrects';
        } else if (err.response.status === 404) {
          errorMsg = err.response.data?.message || 'Utilisateur non trouvé';
        } else if (err.response.status === 500) {
          errorMsg = 'Erreur serveur. Réessayez plus tard.';
        } else {
          errorMsg = err.response.data?.message || 'Erreur de connexion';
        }
      } else if (err.request) {
        errorMsg = 'Impossible de contacter le serveur';
      }
      
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur de déconnexion';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refetch: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
