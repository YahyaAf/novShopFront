import { useState, useEffect } from 'react';
import { useClientMutations } from '../../hooks/useClients';

const ClientFormModal = ({ client, onClose, onSuccess }) => {
  const { createClient, updateClient, loading } = useClientMutations();
  const isEditMode = !!client;

  const [formData, setFormData] = useState({
    telephone: '',
    adresse: '',
    niveauFidelite: 'BASIC',
    user: {
      username: '',
      password: '',
      role: 'CLIENT'
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        niveauFidelite: client.niveauFidelite || 'BASIC',
        user: {
          username: client.username || '',
          password: '',
          role: 'CLIENT'
        }
      });
    }
  }, [client]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Téléphone requis';
    } else if (!/^(\+212|0)[5-7][0-9]{8}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format: +212XXXXXXXXX ou 0XXXXXXXXX';
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'Adresse requise';
    } else if (formData.adresse.length < 10 || formData.adresse.length > 255) {
      newErrors.adresse = 'Adresse entre 10 et 255 caractères';
    }

    if (!formData.user.username.trim()) {
      newErrors.username = 'Username requis';
    }

    if (!isEditMode && !formData.user.password.trim()) {
      newErrors.password = 'Mot de passe requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('user.')) {
      const userField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        user: { ...prev.user, [userField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = isEditMode
      ? await updateClient(client.id, formData)
      : await createClient(formData);

    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Modifier le Client' : 'Nouveau Client'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Informations Utilisateur</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  name="user.username"
                  value={formData.user.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john_doe"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe {isEditMode && '(laisser vide pour ne pas changer)'}
                </label>
                <input
                  type="password"
                  name="user.password"
                  value={formData.user.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isEditMode ? 'Nouveau mot de passe' : 'Mot de passe'}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Informations Client</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+212612345678 ou 0612345678"
                />
                {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.adresse ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Rue Example, Casablanca, Maroc"
                />
                {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau de Fidélité *</label>
                <select
                  name="niveauFidelite"
                  value={formData.niveauFidelite}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="BASIC">⭐ BASIC</option>
                  <option value="SILVER">🥈 SILVER</option>
                  <option value="GOLD">🥇 GOLD</option>
                  <option value="PLATINUM">💎 PLATINUM</option>
                </select>
              </div>
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

export default ClientFormModal;
