// src/services/userService.ts
import { apiClient } from './apiClient';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
  department?: string;
  position?: string;
  managerId?: number;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  position?: string;
  roleId?: number;
  managerId?: number;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  position?: string;
  managerId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  // Get all users (admin only)
  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await apiClient.request('/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // Get user by ID
  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await apiClient.request(`/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  // Create new user (admin only)
  createUser: async (userData: CreateUserData): Promise<UserResponse> => {
    const response = await apiClient.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }
    return response.json();
  },

  // Update user
  updateUser: async (
    id: number,
    userData: UpdateUserData,
  ): Promise<UserResponse> => {
    const response = await apiClient.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }
    return response.json();
  },

  // Delete user (admin only)
  deleteUser: async (id: number): Promise<void> => {
    const response = await apiClient.request(`/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
  },

  // Get roles
  getRoles: async (): Promise<
    Array<{ id: number; name: string; description: string }>
  > => {
    const response = await apiClient.request('/users/roles');
    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }
    return response.json();
  },
};
