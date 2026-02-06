import { useMyClientStats } from '../../hooks/useClients';
import ClientLayout from '../../layouts/ClientLayout';

const ClientStatsPage = () => {
  const { stats, loading, error, isClient } = useMyClientStats();

  const getTierColor = (tier) => {
    switch (tier) {
      case 'BASIC':
        return 'from-gray-400 to-gray-600';
      case 'SILVER':
        return 'from-slate-400 to-slate-600';
      case 'GOLD':
        return 'from-yellow-400 to-yellow-600';
      case 'PLATINUM':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'SILVER':
        return '🥈';
      case 'GOLD':
        return '🥇';
      case 'PLATINUM':
        return '💎';
      default:
        return '⭐';
    }
  };

  const getProgressPercentage = () => {
    if (!stats || !stats.prochainNiveau) return 100;

    const currentTier = stats.niveauFidelite;
    let orderProgress = 0;
    let spendProgress = 0;

    switch (currentTier) {
      case 'BASIC':
        orderProgress = (stats.totalOrders / 3) * 100;
        spendProgress = (stats.totalSpent / 1000) * 100;
        break;
      case 'SILVER':
        orderProgress = (stats.totalOrders / 10) * 100;
        spendProgress = (stats.totalSpent / 5000) * 100;
        break;
      case 'GOLD':
        orderProgress = (stats.totalOrders / 20) * 100;
        spendProgress = (stats.totalSpent / 15000) * 100;
        break;
      default:
        return 100;
    }

    return Math.min((orderProgress + spendProgress) / 2, 100);
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <div className="flex items-start">
              <svg className="w-8 h-8 text-yellow-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Profil client non trouvé</h3>
                <p className="text-yellow-700 mb-4">
                  {isClient === false 
                    ? "Vous n'avez pas de profil client. Seuls les utilisateurs avec un rôle CLIENT peuvent accéder aux statistiques."
                    : error
                  }
                </p>
                <p className="text-sm text-yellow-600">
                  Contactez un administrateur pour créer votre profil client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!stats) {
    return (
      <ClientLayout>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded">
          Aucune statistique disponible
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Statistiques</h1>
          <p className="text-gray-600">Suivez votre progression et votre niveau de fidélité</p>
        </div>

        <div className={`bg-gradient-to-r ${getTierColor(stats.niveauFidelite)} rounded-2xl shadow-2xl p-8 text-white`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{getTierIcon(stats.niveauFidelite)}</div>
            <h2 className="text-3xl font-bold mb-2">Niveau {stats.niveauFidelite}</h2>
            <p className="text-lg opacity-90">Bienvenue, {stats.nom}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Commandes</h3>
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-indigo-600 mb-2">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500">Total de commandes passées</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Dépenses</h3>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{stats.totalSpent?.toFixed(2)} DH</p>
            <p className="text-sm text-gray-500">Montant total dépensé</p>
          </div>
        </div>

        {stats.prochainNiveau && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Progression vers {stats.prochainNiveau}</h3>
              <span className="text-2xl">{getTierIcon(stats.prochainNiveau)}</span>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Progression globale</span>
                  <span className="text-sm font-medium text-indigo-600">{getProgressPercentage().toFixed(0)}%</span>
                </div>
                <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                  <div
                    style={{ width: `${getProgressPercentage()}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {stats.commandesRestantes !== null && (
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Commandes restantes</p>
                    <p className="text-2xl font-bold text-indigo-600">{stats.commandesRestantes}</p>
                  </div>
                )}

                {stats.montantRestant !== null && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Montant restant</p>
                    <p className="text-2xl font-bold text-green-600">{stats.montantRestant?.toFixed(2)} DH</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!stats.prochainNiveau && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Félicitations!</h3>
            <p className="text-lg">Vous avez atteint le niveau maximum: PLATINUM</p>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Avantages de votre niveau
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {stats.niveauFidelite === 'BASIC' && (
              <>
                <li className="flex items-center">✓ Accès aux offres standards</li>
                <li className="flex items-center">✓ Support client par email</li>
              </>
            )}
            {stats.niveauFidelite === 'SILVER' && (
              <>
                <li className="flex items-center">✓ 5% de réduction sur toutes les commandes</li>
                <li className="flex items-center">✓ Livraison gratuite à partir de 500 DH</li>
                <li className="flex items-center">✓ Support client prioritaire</li>
              </>
            )}
            {stats.niveauFidelite === 'GOLD' && (
              <>
                <li className="flex items-center">✓ 10% de réduction sur toutes les commandes</li>
                <li className="flex items-center">✓ Livraison gratuite sans minimum</li>
                <li className="flex items-center">✓ Accès aux ventes privées</li>
                <li className="flex items-center">✓ Support client 24/7</li>
              </>
            )}
            {stats.niveauFidelite === 'PLATINUM' && (
              <>
                <li className="flex items-center">✓ 15% de réduction permanente</li>
                <li className="flex items-center">✓ Livraison express gratuite</li>
                <li className="flex items-center">✓ Accès VIP aux nouveautés</li>
                <li className="flex items-center">✓ Gestionnaire de compte dédié</li>
                <li className="flex items-center">✓ Cadeaux exclusifs</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientStatsPage;
