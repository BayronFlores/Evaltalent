import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import LoadingSpinner from '../common/LoadingSpinner';
import { ROUTES } from '../../types/routes';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, initialized, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

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
    <Navigate
      to={userRole ? `/${userRole}/${ROUTES.DASHBOARD}` : ROUTES.LOGIN}
      replace
    />
  );
};

export default PublicRoute;
