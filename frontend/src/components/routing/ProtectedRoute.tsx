import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { UserRole } from '../../types/UserType';
import LoadingSpinner from '../common/LoadingSpinner';
import { ROUTES } from '../../types/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, loading, initialized, user } = useSelector(
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

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.NO_AUTORIZADO} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
