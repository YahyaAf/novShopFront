import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-indigo-600 font-semibold">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div className="min-h-screen bg-gray-100">{children}</div>;
};

export default DashboardLayout;
