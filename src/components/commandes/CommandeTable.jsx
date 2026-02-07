const CommandeTable = ({ commandes, onViewDetails, onConfirm, onCancel }) => {
  const getStatusBadge = (status) => {
    const badges = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: '⏳',
        label: 'En attente'
      },
      CONFIRMED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: '✅',
        label: 'Confirmée'
      },
      CANCELED: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: '❌',
        label: 'Annulée'
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: '🚫',
        label: 'Rejetée'
      }
    };

    const badge = badges[status] || badges.PENDING;

    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-sm font-semibold flex items-center space-x-1 w-fit`}>
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
      <span className={`px-2 py-1 ${badge.bg} ${badge.text} rounded text-xs font-semibold`}>
        {badge.label}
      </span>
    );
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  if (commandes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle commande.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numéro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant TTC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {commandes.map((commande) => (
            <tr key={commande.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-indigo-600">
                  {commande.numeroCommande}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(commande.dateCreation)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{commande.clientNom}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {getTierBadge(commande.clientNiveauFidelite)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">{formatPrice(commande.totalTTC)}</div>
                {commande.montantRemiseTotal > 0 && (
                  <div className="text-xs text-green-600">
                    Remise: -{formatPrice(commande.montantRemiseTotal)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(commande.statut)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onViewDetails(commande)}
                  className="text-indigo-600 hover:text-indigo-900 inline-flex items-center px-3 py-1 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Détails
                </button>
                {commande.statut === 'PENDING' && (
                  <>
                    {commande.montantRestant === 0 && (
                      <button
                        onClick={() => onConfirm(commande)}
                        className="text-green-600 hover:text-green-900 inline-flex items-center px-3 py-1 border border-green-300 rounded-lg hover:bg-green-50 transition"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Confirmer
                      </button>
                    )}
                    <button
                      onClick={() => onCancel(commande)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Annuler
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeTable;
