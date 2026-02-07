import { useState, useEffect } from 'react';
import { useCommandeMutations } from '../../hooks/useCommandes';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';

const CommandeFormModal = ({ onClose, onSuccess }) => {
  const { createCommande, loading, error } = useCommandeMutations();
  const { clients } = useClients();
  const { products } = useProducts();
  
  const [formData, setFormData] = useState({
    clientId: '',
    items: [],
    codePromo: ''
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantite: 1
  });

  const [validationErrors, setValidationErrors] = useState({});

  const getAvailableStock = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    return product?.stock || 0;
  };

  const getProductInfo = (productId) => {
    return products.find(p => p.id === parseInt(productId));
  };

  const addItem = () => {
    if (!currentItem.productId || currentItem.quantite < 1) {
      setValidationErrors({ ...validationErrors, item: 'Sélectionnez un produit et une quantité valide' });
      return;
    }

    const product = getProductInfo(currentItem.productId);
    if (currentItem.quantite > product.stock) {
      setValidationErrors({ ...validationErrors, item: `Stock insuffisant (disponible: ${product.stock})` });
      return;
    }

    const existingIndex = formData.items.findIndex(item => item.productId === parseInt(currentItem.productId));
    
    if (existingIndex >= 0) {
      const newItems = [...formData.items];
      newItems[existingIndex].quantite += currentItem.quantite;
      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { ...currentItem, productId: parseInt(currentItem.productId) }]
      });
    }

    setCurrentItem({ productId: '', quantite: 1 });
    setValidationErrors({ ...validationErrors, item: undefined });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.clientId) {
      errors.clientId = 'Veuillez sélectionner un client';
    }

    if (formData.items.length === 0) {
      errors.items = 'Veuillez ajouter au moins un produit';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const commandeData = {
      clientId: parseInt(formData.clientId),
      items: formData.items,
      codePromo: formData.codePromo || null
    };

    const result = await createCommande(commandeData);

    if (result.success) {
      onSuccess();
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = getProductInfo(item.productId);
      return total + (product?.prixUnitaire || 0) * item.quantite;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle commande</h2>
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
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                validationErrors.clientId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.username} ({client.niveauFidelite})
                </option>
              ))}
            </select>
            {validationErrors.clientId && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.clientId}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter des produits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="md:col-span-2">
                <select
                  value={currentItem.productId}
                  onChange={(e) => setCurrentItem({ ...currentItem, productId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un produit</option>
                  {products.filter(p => p.stock > 0).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nom} - {formatPrice(product.prixUnitaire)} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max={currentItem.productId ? getAvailableStock(currentItem.productId) : 999}
                  value={currentItem.quantite}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantite: parseInt(e.target.value) || 1 })}
                  placeholder="Qté"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {validationErrors.item && (
              <p className="text-red-500 text-sm mb-3">{validationErrors.item}</p>
            )}

            {formData.items.length > 0 && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qté</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Prix unit.</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.items.map((item, index) => {
                      const product = getProductInfo(item.productId);
                      return (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{product?.nom}</td>
                          <td className="px-4 py-2 text-sm text-center text-gray-700">{item.quantite}</td>
                          <td className="px-4 py-2 text-sm text-right text-gray-700">{formatPrice(product?.prixUnitaire)}</td>
                          <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatPrice((product?.prixUnitaire || 0) * item.quantite)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right text-sm font-bold text-gray-900">Sous-total HT:</td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-indigo-600">{formatPrice(calculateTotal())}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {validationErrors.items && (
              <p className="text-red-500 text-sm mt-2">{validationErrors.items}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Promo (optionnel)
            </label>
            <input
              type="text"
              value={formData.codePromo}
              onChange={(e) => setFormData({ ...formData, codePromo: e.target.value.toUpperCase() })}
              placeholder="PROMO2024"
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Remise de 5% si le code est valide</p>
          </div>

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
              {loading ? 'Création...' : 'Créer la commande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommandeFormModal;
