import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ClientLayout from '../../layouts/ClientLayout';

const ClientHomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const isClient = user?.role === 'CLIENT';

  return (
    <ClientLayout>
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Bienvenue sur NovaShop</h1>
        <p className="text-xl text-gray-600 mb-8">Découvrez nos produits exclusifs</p>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">Bonjour <span className="font-semibold text-indigo-600">{user?.username}</span>!</p>
            {isClient ? (
              <Link
                to="/stats"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Voir mes statistiques
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Accéder au Dashboard
              </Link>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Se connecter
          </Link>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold mb-2">Large Sélection</h3>
            <p className="text-gray-600">Des milliers de produits disponibles</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
            <p className="text-gray-600">Livraison sous 48h partout au Maroc</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">Programme Fidélité</h3>
            <p className="text-gray-600">Gagnez des récompenses à chaque achat</p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientHomePage;

