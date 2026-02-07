import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import UsersPage from './pages/dashboard/UsersPage';
import ClientsPage from './pages/dashboard/ClientsPage';
import ProductsPage from './pages/dashboard/ProductsPage';
import PromosPage from './pages/dashboard/PromosPage';
import CommandesPage from './pages/dashboard/CommandesPage';
import ClientHomePage from './pages/client/ClientHomePage';
import ClientStatsPage from './pages/client/ClientStatsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardHomePage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard/users"
            element={
              <PrivateRoute>
                <UsersPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard/clients"
            element={
              <PrivateRoute>
                <ClientsPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard/products"
            element={
              <PrivateRoute>
                <ProductsPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard/promos"
            element={
              <PrivateRoute>
                <PromosPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard/commandes"
            element={
              <PrivateRoute>
                <CommandesPage />
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<ClientHomePage />} />
          
          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <ClientStatsPage />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
