import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Usuario no tiene permiso para esta ruta

    // Construir la ruta correcta para el rol actual
    const pathParts = location.pathname.split('/').filter(Boolean); // ej: ['admin', 'profile']
    if (pathParts.length > 1) {
      pathParts[0] = user.role; // reemplaza el prefijo por el rol real
      const correctPath = '/' + pathParts.join('/');
      return <Navigate to={correctPath} replace />;
    }

    // Si no se puede construir ruta, redirige a no autorizado
    return <Navigate to={ROUTES.NO_AUTORIZADO} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
