import { useState } from 'react';
import { useProducts, useProductMutations } from '../../hooks/useProducts';
import DashboardLayout from '../../layouts/DashboardLayout';
import ProductTable from '../../components/products/ProductTable';
import ProductFormModal from '../../components/products/ProductFormModal';
import DeleteModal from '../../components/common/DeleteModal';

const ProductsPage = () => {
  const { products, pagination, loading, error, refetch, updateParams, params } = useProducts();
  const { deleteProduct } = useProductMutations();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [filters, setFilters] = useState({
    nom: '',
    minPrice: '',
    maxPrice: '',
    inStock: ''
  });

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    const result = await deleteProduct(selectedProduct.id);
    if (result.success) {
      setIsDeleteModalOpen(false);
      refetch();
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    refetch();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filterParams = {
      page: 0,
      ...filters
    };
    
    Object.keys(filterParams).forEach(key => {
      if (filterParams[key] === '' || filterParams[key] === null) {
        delete filterParams[key];
      }
    });

    updateParams(filterParams);
  };

  const resetFilters = () => {
    setFilters({
      nom: '',
      minPrice: '',
      maxPrice: '',
      inStock: ''
    });
    updateParams({ 
      page: 0,
      nom: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined
    });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };

  const handleSortChange = (sortBy) => {
    const newSortDir = params.sortBy === sortBy && params.sortDir === 'asc' ? 'desc' : 'asc';
    updateParams({ sortBy, sortDir: newSortDir });
  };

  if (loading && products.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-1">Gérez votre catalogue de produits</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouveau Produit</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={filters.nom}
              onChange={handleFilterChange}
              placeholder="Rechercher..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix min (DH)</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix max (DH)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
            <select
              name="inStock"
              value={filters.inStock}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="true">En stock</option>
              <option value="false">Rupture de stock</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Appliquer
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-700">
            <strong>Total:</strong> {pagination.totalElements} produit(s) | 
            <strong className="ml-2">Page:</strong> {pagination.currentPage + 1} / {pagination.totalPages}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 0}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-gray-700">
            {pagination.currentPage + 1} / {pagination.totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          title="Supprimer le produit"
          message={`Êtes-vous sûr de vouloir supprimer le produit "${selectedProduct?.nom}" ? Cette action est irréversible.`}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isDangerous={true}
        />
      )}
    </DashboardLayout>
  );
};

export default ProductsPage;
