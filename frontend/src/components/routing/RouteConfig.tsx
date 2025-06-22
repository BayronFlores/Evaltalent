import React from 'react';
import { Route } from 'react-router-dom';
import { UserRole } from '../../types/UserType';
import ProtectedRoute from './ProtectedRoute';

// Import pages
import DashboardPage from '../../pages/Dashboard/DashboardPage';
import EvaluationsPage from '../../pages/EvaluationsPage';
import UsersPage from '../../pages/UsersPage';
import ReportsPage from '../../pages/ReportsPage';
import ProfilePage from '../../pages/ProfilePage';
import RolesPage from '../roles/RolesPage';
import TeamPage from '../../pages/TeamPage';

import {
  ALL_ROLES,
  ADMIN_ONLY,
  ADMIN_MANAGER,
  MANAGER_ONLY,
} from '../../types/routes';

interface RouteItem {
  path: string;
  element: React.ReactNode;
  allowedRoles: UserRole[];
}

const routeConfigs: RouteItem[] = [
  {
    path: 'dashboard',
    element: <DashboardPage />,
    allowedRoles: ALL_ROLES,
  },
  {
    path: 'evaluations',
    element: <EvaluationsPage />,
    allowedRoles: ALL_ROLES,
  },
  {
    path: 'users',
    element: <UsersPage />,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: 'reports',
    element: <ReportsPage />,
    allowedRoles: ADMIN_MANAGER,
  },
  {
    path: 'Roles',
    element: <RolesPage />,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: 'Team',
    element: <TeamPage />,
    allowedRoles: MANAGER_ONLY,
  },
  {
    path: 'profile',
    element: <ProfilePage />,
    allowedRoles: ALL_ROLES,
  },
];

export const renderProtectedRoutes = () => {
  return routeConfigs.map(({ path, element, allowedRoles }) => (
    <Route
      key={path}
      path={path}
      element={
        <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
      }
    />
  ));
};
