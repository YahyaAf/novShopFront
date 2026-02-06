import { useState, useEffect } from 'react';
import { useProductMutations } from '../../hooks/useProducts';

const ProductFormModal = ({ product, onClose, onSuccess }) => {
  const { createProduct, updateProduct, loading } = useProductMutations();
  const isEditMode = !!product;

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prixUnitaire: '',
    stock: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        nom: product.nom || '',
        description: product.description || '',
        prixUnitaire: product.prixUnitaire || '',
        stock: product.stock || ''
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 3 || formData.nom.length > 100) {
      newErrors.nom = 'Le nom doit contenir entre 3 et 100 caractères';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La description ne peut pas dépasser 1000 caractères';
    }

    const prix = parseFloat(formData.prixUnitaire);
    if (!formData.prixUnitaire) {
      newErrors.prixUnitaire = 'Le prix est requis';
    } else if (isNaN(prix) || prix < 0.01) {
      newErrors.prixUnitaire = 'Le prix doit être supérieur à 0';
    } else if (prix > 999999.99) {
      newErrors.prixUnitaire = 'Le prix ne peut pas dépasser 999999.99';
    }

    const stockValue = parseInt(formData.stock);
    if (formData.stock === '') {
      newErrors.stock = 'Le stock est requis';
    } else if (isNaN(stockValue) || stockValue < 0) {
      newErrors.stock = 'Le stock ne peut pas être négatif';
    } else if (stockValue > 999999) {
      newErrors.stock = 'Le stock ne peut pas dépasser 999999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const dataToSubmit = {
      nom: formData.nom,
      description: formData.description || null,
      prixUnitaire: parseFloat(formData.prixUnitaire),
      stock: parseInt(formData.stock)
    };

    const result = isEditMode
      ? await updateProduct(product.id, dataToSubmit)
      : await createProduct(dataToSubmit);

    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Modifier le Produit' : 'Nouveau Produit'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Laptop HP"
            />
            {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Description détaillée du produit..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.description.length} / 1000 caractères</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (DH) *</label>
              <input
                type="number"
                name="prixUnitaire"
                step="0.01"
                value={formData.prixUnitaire}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.prixUnitaire ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.prixUnitaire && <p className="mt-1 text-sm text-red-600">{errors.prixUnitaire}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 flex items-center space-x-2"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>{isEditMode ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
