import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import { useAuthInitialization } from './hooks/useAuthInitialization';
import { ROUTES } from './types/routes';

// Import components
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import { renderProtectedRoutes } from './components/routing/RouteConfig';

// Import pages
import LoginPage from './pages/LoginPage';
import NoAutorizado from './pages/NoAutorizado';

// Import layout
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  useAuthInitialization();

  const userRole = useSelector(
    (state: RootState) => state.auth.user?.role ?? null,
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* No Autorizado Route */}
        <Route path={ROUTES.NO_AUTORIZADO} element={<NoAutorizado />} />

        {/* Protected Routes con prefijo de rol como ruta padre */}

        <Route
          path={`/${userRole}`}
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          {userRole && renderProtectedRoutes(userRole)}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </div>
  );
};

export default App;
