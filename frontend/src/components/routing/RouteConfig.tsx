import React from 'react';
import { Route } from 'react-router-dom';
import { UserRole } from '../../types/UserType';
import ProtectedRoute from './ProtectedRoute';
import {
  ROUTES,
  ADMIN_ONLY,
  MANAGER_ONLY,
  ADMIN_MANAGER,
  ALL_ROLES,
  EMPLOYEE_ONLY,
} from '../../types/routes';
import { ClipboardList, FileText, User, Users, Home } from 'lucide-react';

// Importar páginas
import DashboardPage from '../../pages/Dashboard/DashboardPage';
import UsersPage from '../../pages/UsersPage';
import ReportsPage from '../../pages/ReportsPage';
import ProfilePage from '../../pages/ProfilePage';
import RolesPage from '../roles/RolesPage';
import TeamPage from '../../pages/TeamPage';
import EvaluationsPage from '../../pages/EvaluationsPage';
import Assessment from '../../pages/employee/Self-Assessment';
import Training from '../../pages/employee/Training';
import Results from '../../pages/employee/Results';

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  allowedRoles: UserRole[];
  name: string;
  icon: React.ComponentType<any>;
}

export const getAppRoutes = (): AppRoute[] => [
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
    allowedRoles: ALL_ROLES,
    name: 'Dashboard',
    icon: Home,
  },
  {
    path: ROUTES.EVALUATIONS,
    element: <EvaluationsPage />,
    allowedRoles: ALL_ROLES,
    name: 'Evaluaciones',
    icon: ClipboardList,
  },
  {
    path: ROUTES.USERS,
    element: <UsersPage />,
    allowedRoles: ADMIN_ONLY,
    name: 'Usuarios',
    icon: User,
  },
  {
    path: ROUTES.REPORTS,
    element: <ReportsPage />,
    allowedRoles: ADMIN_MANAGER,
    name: 'Reportes',
    icon: FileText,
  },
  {
    path: ROUTES.TEAM,
    element: <TeamPage />,
    allowedRoles: MANAGER_ONLY,
    name: 'Team',
    icon: Users,
  },
  {
    path: ROUTES.ROLES,
    element: <RolesPage />,
    allowedRoles: ADMIN_ONLY,
    name: 'Roles',
    icon: Users,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
    allowedRoles: ALL_ROLES,
    name: 'Perfil',
    icon: User,
  },
  {
    path: ROUTES.ASSESSMENT,
    element: <Assessment />,
    allowedRoles: EMPLOYEE_ONLY,
    name: 'assessment',
    icon: User,
  },
  {
    path: ROUTES.TRAINING,
    element: <Training />,
    allowedRoles: EMPLOYEE_ONLY,
    name: 'training',
    icon: User,
  },
  {
    path: ROUTES.RESULT,
    element: <Results />,
    allowedRoles: EMPLOYEE_ONLY,
    name: 'result',
    icon: User,
  },
];

export const renderProtectedRoutes = (role: UserRole) => {
  const routesToRender = getAppRoutes().filter((route) =>
    route.allowedRoles.includes(role),
  );

  return routesToRender.map(({ path, element, allowedRoles }) => (
    <Route
      key={`${role}-${path}`}
      path={path}
      element={
        <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
      }
    />
  ));
};
