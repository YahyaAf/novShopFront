const CommandeDetailsModal = ({ commande, onClose }) => {
  if (!commande) return null;

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
                <>
                  <div className="border-t pt-2 flex justify-between text-sm">
                    <span className="text-gray-600">Montant HT après remise:</span>
                    <span className="font-medium text-gray-900">{formatPrice(commande.montantHtApresRemise)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA (20%):</span>
                <span className="font-medium text-gray-900">{formatPrice(commande.tva)}</span>
              </div>

              <div className="border-t-2 border-indigo-200 pt-3 flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total TTC:</span>
                <span className="font-bold text-indigo-600">{formatPrice(commande.totalTTC)}</span>
              </div>

              {commande.montantRestant > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-yellow-800">Montant restant à payer:</span>
                    <span className="text-sm font-bold text-yellow-900">{formatPrice(commande.montantRestant)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
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
    </div>
  );
};

export default CommandeDetailsModal;
