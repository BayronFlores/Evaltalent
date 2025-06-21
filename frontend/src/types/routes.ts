import { UserRole } from '../types/UserType';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EVALUATIONS: '/evaluations',
  USERS: '/users',
  REPORTS: '/reports',
  ROLES: '/Roles',
  PROFILE: '/profile',
  NO_AUTORIZADO: '/no-autorizado',
} as const;

export const ALL_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.EMPLOYEE,
];

export const ADMIN_ONLY: UserRole[] = [UserRole.ADMIN];
export const MANAGER_ONLY: UserRole[] = [UserRole.MANAGER];
export const ADMIN_MANAGER: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER];
