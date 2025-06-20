export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roleId: number;
  department?: string;
  position?: string;
  isActive: boolean;

  createdAt: string; // o Date si lo estás manejando como objeto Date
  updatedAt: string;
  managerId?: number | null; // Opcional y puede ser null
}

export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: number[];
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
  department?: string;
  position?: string;
}

export interface UpdateUserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  department?: string;
  position?: string;
  isActive: boolean;
}
