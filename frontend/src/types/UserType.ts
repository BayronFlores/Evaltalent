export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleId: number;
  department?: string;
  position?: string;
  isActive: boolean;
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
