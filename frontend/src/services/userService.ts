// src/services/userService.ts
const API_BASE_URL = 'http://localhost:5000/api';
import type {
  User,
  Role,
  CreateUserData,
  UpdateUserData,
} from '../types/UserType';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const userService = {
  // Obtener todos los usuarios
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      return data.users;
    } catch (error) {
      console.error('❌ Get users error:', error);
      throw error;
    }
  },

  // Obtener todos los roles
  getRoles: async (): Promise<Role[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener roles');
      }

      const data = await response.json();
      return data.roles;
    } catch (error) {
      console.error('❌ Get roles error:', error);
      throw error;
    }
  },

  // Crear usuario
  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear usuario');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('❌ Create user error:', error);
      throw error;
    }
  },

  // Actualizar usuario
  updateUser: async (id: number, userData: UpdateUserData): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar usuario');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('❌ Update user error:', error);
      throw error;
    }
  },

  // Eliminar usuario
  deleteUser: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('❌ Delete user error:', error);
      throw error;
    }
  },
};
