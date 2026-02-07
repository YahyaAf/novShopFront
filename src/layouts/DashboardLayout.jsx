import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!loading && user && user.role !== 'ADMIN') {
    return <Navigate to="/stats" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">SmartShop</h1>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Accueil
                </Link>
                <Link
                  to="/dashboard/users"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard/users')
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Utilisateurs
                </Link>
                <Link
                  to="/dashboard/clients"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard/clients')
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Clients
                </Link>
                <Link
                  to="/dashboard/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard/products')
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Produits
                </Link>
                <Link
                  to="/dashboard/promos"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard/promos')
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Promos
                </Link>
                <Link
                  to="/dashboard/commandes"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard/commandes')
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Commandes
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-slate-700">
                    <span className="font-semibold">{user.username}</span>
                    <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                      {user.role}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition transform hover:scale-105 disabled:opacity-60 shadow-md"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
