import { useState } from 'react';
import { usePaymentMutations } from '../../hooks/usePayments';

const PaymentFormModal = ({ commande, onClose, onSuccess }) => {
  const { createPayment, loading, error } = usePaymentMutations();
  
  const [formData, setFormData] = useState({
    commandeId: commande?.id || '',
    montant: '',
    typePaiement: 'ESPECES',
    reference: '',
    banque: '',
    echeance: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const ESPECES_LIMIT = 20000;

  const validateForm = () => {
    const errors = {};

    if (!formData.montant) {
      errors.montant = 'Le montant est requis';
    } else {
      const montant = parseFloat(formData.montant);
      if (montant <= 0) {
        errors.montant = 'Le montant doit être supérieur à 0';
      } else if (montant > (commande?.montantRestant || 0)) {
        errors.montant = `Le montant ne peut pas dépasser le restant dû (${formatPrice(commande?.montantRestant)})`;
      } else if (formData.typePaiement === 'ESPECES' && montant > ESPECES_LIMIT) {
        errors.montant = `Paiement en espèces limité à ${formatPrice(ESPECES_LIMIT)} (Art. 193 CGI)`;
      }
    }

    if (!formData.typePaiement) {
      errors.typePaiement = 'Le type de paiement est requis';
    }

    if ((formData.typePaiement === 'CHEQUE' || formData.typePaiement === 'VIREMENT') && !formData.reference) {
      errors.reference = 'La référence est requise pour ce type de paiement';
    }

    if ((formData.typePaiement === 'CHEQUE' || formData.typePaiement === 'VIREMENT') && !formData.banque) {
      errors.banque = 'Le nom de la banque est requis pour ce type de paiement';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError(null);
    setSuccessMessage(null);
    
    if (!validateForm()) {
      return;
    }

    const paymentData = {
      commandeId: commande.id,
      montant: parseFloat(formData.montant),
      typePaiement: formData.typePaiement,
      reference: formData.reference || null,
      banque: formData.banque || null,
      echeance: formData.echeance || null
    };

    const result = await createPayment(paymentData);

    if (result.success) {
      setSuccessMessage(result.message || 'Paiement enregistré avec succès');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setBackendError(result.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: undefined });
    }
    
    setBackendError(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  const getTypeLabel = (type) => {
    const labels = {
      ESPECES: '💵 Espèces',
      CHEQUE: '📝 Chèque',
      VIREMENT: '🏦 Virement'
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nouveau paiement</h2>
            <p className="text-sm text-gray-500 mt-1">{commande?.numeroCommande}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {(backendError || error) && (
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{backendError || error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total TTC:</span>
                <p className="font-bold text-lg text-gray-900">{formatPrice(commande?.totalTTC)}</p>
              </div>
              <div>
                <span className="text-gray-600">Restant à payer:</span>
                <p className="font-bold text-lg text-indigo-600">{formatPrice(commande?.montantRestant)}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant à encaisser <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max={commande?.montantRestant}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                validationErrors.montant ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.montant && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.montant}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {formatPrice(commande?.montantRestant)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de paiement <span className="text-red-500">*</span>
            </label>
            <select
              name="typePaiement"
              value={formData.typePaiement}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                validationErrors.typePaiement ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="ESPECES">{getTypeLabel('ESPECES')}</option>
              <option value="CHEQUE">{getTypeLabel('CHEQUE')}</option>
              <option value="VIREMENT">{getTypeLabel('VIREMENT')}</option>
            </select>
            {validationErrors.typePaiement && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.typePaiement}</p>
            )}
            {formData.typePaiement === 'ESPECES' && (
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Limité à {formatPrice(ESPECES_LIMIT)} selon l'article 193 CGI
              </p>
            )}
          </div>

          {(formData.typePaiement === 'CHEQUE' || formData.typePaiement === 'VIREMENT') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Référence <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder={formData.typePaiement === 'CHEQUE' ? 'Numéro du chèque' : 'Référence du virement'}
                  maxLength={100}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    validationErrors.reference ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.reference && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.reference}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banque <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="banque"
                  value={formData.banque}
                  onChange={handleChange}
                  placeholder="Nom de la banque"
                  maxLength={100}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    validationErrors.banque ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.banque && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.banque}</p>
                )}
              </div>

              {formData.typePaiement === 'CHEQUE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'échéance (optionnel)
                  </label>
                  <input
                    type="date"
                    name="echeance"
                    value={formData.echeance}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || successMessage}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Encaisser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentFormModal;
