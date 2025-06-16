import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './redux/store';
import { initializeAuth } from './redux/slices/authSlises';

// Import pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import EvaluationsPage from './pages/EvaluationsPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

// Import layout
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading, initialized } = useSelector(
    (state: RootState) => state.auth,
  );

  // Show loading while initializing auth
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <LoadingSpinner />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, initialized, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  // Show loading while initializing auth
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <LoadingSpinner />
      </div>
    );
  }

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { initialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initialize authentication state on app load
    if (!initialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;
