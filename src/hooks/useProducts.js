import { useState, useEffect } from 'react';
import productService from '../services/product.service';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchProducts = async (newParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAll(newParams);
      
      if (response.data?.content) {
        setProducts(response.data.content);
        setPagination({
          currentPage: response.data.number,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          size: response.data.size
        });
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateParams = (newParams) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    fetchProducts(updatedParams);
  };

  return { 
    products, 
    pagination, 
    loading, 
    error, 
    refetch: fetchProducts,
    updateParams,
    params
  };
};

export const useProductMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.create(productData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création du produit';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.update(id, productData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du produit';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await productService.softDelete(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression du produit';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, updateProduct, deleteProduct, loading, error };
};
