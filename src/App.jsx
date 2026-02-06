import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import UsersPage from './pages/dashboard/UsersPage';
import ClientHomePage from './pages/client/ClientHomePage';

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
          
          <Route path="/" element={<ClientHomePage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
