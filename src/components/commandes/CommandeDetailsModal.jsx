import { useState } from 'react';
import { usePaymentsByCommande, usePaymentSummary } from '../../hooks/usePayments';
import PaymentFormModal from '../payments/PaymentFormModal';

const CommandeDetailsModal = ({ commande, onClose, onUpdate }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { payments, loading: paymentsLoading, error: paymentsError, refetch: refetchPayments } = usePaymentsByCommande(commande?.id);
  const { summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = usePaymentSummary(commande?.id);

  if (!commande) return null;

  const handlePaymentSuccess = () => {
    refetchPayments();
    refetchSummary();
    setShowPaymentModal(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'En attente' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Confirmée' },
      CANCELED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '❌', label: 'Annulée' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚫', label: 'Rejetée' }
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`px-4 py-2 ${badge.bg} ${badge.text} rounded-lg text-sm font-semibold flex items-center space-x-2 w-fit`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  };

  const getTierBadge = (tier) => {
    const badges = {
      BASIC: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Basic' },
      SILVER: { bg: 'bg-slate-200', text: 'text-slate-800', label: 'Silver' },
      GOLD: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Gold' },
      PLATINUM: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Platinum' }
    };
    const badge = badges[tier] || badges.BASIC;
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.text} rounded text-sm font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      EN_ATTENTE: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'En attente' },
      ENCAISSE: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Encaissé' },
      REJETE: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Rejeté' }
    };
    const badge = badges[status] || badges.EN_ATTENTE;
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.text} rounded text-xs font-semibold inline-flex items-center space-x-1`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  };

  const getPaymentTypeLabel = (type) => {
    const labels = {
      ESPECES: '💵 Espèces',
      CHEQUE: '📝 Chèque',
      VIREMENT: '🏦 Virement'
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Détails de la commande</h2>
            <p className="text-sm text-gray-500 mt-1">{commande.numeroCommande}</p>
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

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Informations générales</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date de création:</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(commande.dateCreation)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Statut:</span>
                  {getStatusBadge(commande.statut)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Client</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nom:</span>
                  <span className="text-sm font-medium text-gray-900">{commande.clientNom}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Niveau:</span>
                  {getTierBadge(commande.clientNiveauFidelite)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Articles commandés</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantité</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commande.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productNom}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">{item.quantite}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">{formatPrice(item.prixUnitaire)}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatPrice(item.totalLigne)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif financier</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total HT:</span>
                <span className="font-medium text-gray-900">{formatPrice(commande.sousTotalHt)}</span>
              </div>

              {commande.montantRemiseFidelite > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Remise fidélité:</span>
                  <span className="font-medium text-green-600">-{formatPrice(commande.montantRemiseFidelite)}</span>
                </div>
              )}

              {commande.montantRemisePromo > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Remise promo ({commande.codePromo}):</span>
                  <span className="font-medium text-green-600">-{formatPrice(commande.montantRemisePromo)}</span>
                </div>
              )}

              {commande.montantRemiseTotal > 0 && (
                <div className="border-t pt-2 flex justify-between text-sm">
                  <span className="text-gray-600">Montant HT après remise:</span>
                  <span className="font-medium text-gray-900">{formatPrice(commande.montantHtApresRemise)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA (20%):</span>
                <span className="font-medium text-gray-900">{formatPrice(commande.tva)}</span>
              </div>

              <div className="border-t-2 border-indigo-200 pt-3 flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total TTC:</span>
                <span className="font-bold text-indigo-600">{formatPrice(commande.totalTTC)}</span>
              </div>

              {summary && (
                <>
                  <div className="border-t pt-3 flex justify-between text-sm">
                    <span className="text-purple-700 font-medium">Total payé:</span>
                    <span className="font-bold text-purple-700">{formatPrice(summary.totalPaye)}</span>
                  </div>
                  {summary.montantRestant > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-yellow-800">Montant restant à payer:</span>
                        <span className="text-sm font-bold text-yellow-900">{formatPrice(summary.montantRestant)}</span>
                      </div>
                    </div>
                  )}
                  {summary.estCompletementPaye && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-green-800">Commande entièrement payée</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {commande.statut === 'PENDING' && summary && summary.montantRestant > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Paiements</h3>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Effectuer un paiement</span>
                </button>
              </div>

              {paymentsLoading ? (
                <div className="text-center py-4 text-gray-500">Chargement des paiements...</div>
              ) : paymentsError ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">{paymentsError}</p>
                </div>
              ) : payments && payments.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Paiement</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.numeroPaiement}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{getPaymentTypeLabel(payment.typePaiement)}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatPrice(payment.montant)}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-700">{formatDate(payment.dateCreation)}</td>
                          <td className="px-4 py-3 text-center">{getPaymentStatusBadge(payment.statut)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {payment.reference ? (
                              <div>
                                <span className="font-medium">{payment.reference}</span>
                                {payment.banque && <span className="text-xs text-gray-500 block">{payment.banque}</span>}
                              </div>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-sm">Aucun paiement enregistré</p>
                </div>
              )}
            </div>
          )}

          {commande.statut === 'PENDING' && summary && summary.estCompletementPaye && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">Cette commande est entièrement payée et peut être confirmée.</p>
              </div>
            </div>
          )}

          {payments && payments.length > 0 && commande.statut !== 'PENDING' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Historique des paiements</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Paiement</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.numeroPaiement}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{getPaymentTypeLabel(payment.typePaiement)}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatPrice(payment.montant)}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700">{formatDate(payment.dateCreation)}</td>
                        <td className="px-4 py-3 text-center">{getPaymentStatusBadge(payment.statut)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {payment.reference ? (
                            <div>
                              <span className="font-medium">{payment.reference}</span>
                              {payment.banque && <span className="text-xs text-gray-500 block">{payment.banque}</span>}
                            </div>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentFormModal
          commande={commande}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CommandeDetailsModal;
