import { useState, useEffect } from 'react';
import { usePromoMutations } from '../../hooks/usePromos';

const PromoFormModal = ({ promo, onClose, onSuccess }) => {
  const { createPromo, updatePromo, loading, error } = usePromoMutations();
  
  const [formData, setFormData] = useState({
    code: '',
    maxUsage: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (promo) {
      setFormData({
        code: promo.code || '',
        maxUsage: promo.maxUsage || ''
      });
    }
  }, [promo]);

  const validateForm = () => {
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = 'Le code promo est requis';
    } else if (formData.code.length < 3 || formData.code.length > 50) {
      errors.code = 'Le code doit contenir entre 3 et 50 caractères';
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      errors.code = 'Le code doit contenir uniquement des lettres majuscules et chiffres';
    }

    if (!formData.maxUsage) {
      errors.maxUsage = 'Le nombre maximum d\'utilisations est requis';
    } else {
      const maxUsageNum = parseInt(formData.maxUsage);
      if (maxUsageNum < 1) {
        errors.maxUsage = 'Le nombre doit être au moins 1';
      } else if (maxUsageNum > 10000) {
        errors.maxUsage = 'Le nombre ne peut pas dépasser 10000';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const promoData = {
      code: formData.code.toUpperCase(),
      maxUsage: parseInt(formData.maxUsage)
    };

    const result = promo
      ? await updatePromo(promo.id, promoData)
      : await createPromo(promoData);

    if (result.success) {
      onSuccess();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'code') {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: undefined });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {promo ? 'Modifier le code promo' : 'Nouveau code promo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Promo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="PROMO2024"
              maxLength={50}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                validationErrors.code ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.code && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.code}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Lettres majuscules et chiffres uniquement • {formData.code.length}/50
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre maximum d'utilisations <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleChange}
              placeholder="100"
              min="1"
              max="10000"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                validationErrors.maxUsage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.maxUsage && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.maxUsage}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Entre 1 et 10 000 utilisations</p>
          </div>

          {promo && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-semibold">Utilisation actuelle: {promo.usageCount}</p>
                  <p className="text-xs mt-1">Le nouveau maximum doit être supérieur à l'utilisation actuelle</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Traitement...' : promo ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoFormModal;
