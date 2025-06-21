import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          {renderProtectedRoutes()}
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </div>
  );
};

export default App;
