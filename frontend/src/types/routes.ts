import { UserRole } from '../types/UserType';

export const ROUTES = {
  LOGIN: '/login',
  NO_AUTORIZADO: '/no-autorizado',
  DASHBOARD: 'dashboard',
  EVALUATIONS: 'evaluations',
  USERS: 'users',
  REPORTS: 'reports',
  ROLES: 'roles',
  PROFILE: 'profile',
  TEAM: 'team',
};

export const ALL_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.EMPLOYEE,
];

export const ADMIN_ONLY: UserRole[] = [UserRole.ADMIN];
export const MANAGER_ONLY: UserRole[] = [UserRole.MANAGER];
export const EMPLOYEE_ONLY: UserRole[] = [UserRole.EMPLOYEE];
export const ADMIN_MANAGER: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER];
