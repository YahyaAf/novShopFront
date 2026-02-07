import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (user?.role === 'ADMIN') {
      navigate('/dashboard');
    } else if (user?.role === 'CLIENT') {
      navigate('/stats');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-500 to-purple-600">
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-lg text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Accès Interdit</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas l'autorisation d'accéder à cette ressource.
            {user && (
              <span className="block mt-2 text-sm">
                Connecté en tant que <span className="font-semibold">{user.username}</span> ({user.role})
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Retour à l'accueil</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Retour à la page précédente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
