import type { User, UserRole } from '../types/UserType';
import type { LoginForm } from '../types/FormType';
import { tokenManager } from './tokenManager';

import API_BASE_URL from '../config/api';

// Interfaz para la respuesta del login
interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    hireDate: string | null;
    department: string;
    position: string;
    createdAt: string;
    updatedAt: string;
    managerId?: number | null;
  };
}

// Interfaz para la respuesta del usuario actual
interface UserResponse {
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    role: string;
  };
}

// Función para mapear usuario del backend al tipo User del frontend
const mapBackendUserToUser = (
  backendUser: Partial<LoginResponse['user']>,
): User => {
  return {
    id: backendUser.id!,
    username: backendUser.username!,
    email: backendUser.email!,
    firstName: backendUser.firstName!,
    lastName: backendUser.lastName!,
    role: backendUser.role as UserRole,
    roleId: 0, // o el real si lo tienes
    department: backendUser.department ?? '',
    position: backendUser.position ?? '',
    hireDate: backendUser.hireDate ?? '',
    isActive: true, // o usa backendUser.isActive si viene
    createdAt: backendUser.createdAt ?? new Date().toISOString(),
    updatedAt: backendUser.updatedAt ?? new Date().toISOString(),
    managerId: backendUser.managerId ?? null,
  };
};

export const authService = {
  login: async (
    credentials: LoginForm,
  ): Promise<{ user: User; token: string }> => {
    try {
      console.log('🔄 Enviando login request:', { email: credentials.email });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.email, // El backend espera username
          password: credentials.password,
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login error:', errorData);
        throw new Error(errorData.message || 'Error en el login');
      }

      const data: LoginResponse = await response.json();
      console.log('✅ Login successful - RAW DATA:', data);

      // 🔍 NUEVO LOG: Verificar el token que llega
      console.log('🔍 Token recibido del backend:', data.token);

      // Mapear usuario del backend al formato del frontend
      const user = mapBackendUserToUser(data.user);
      console.log('✅ Mapped user:', user);

      // Limpiar storage antes de guardar nuevos datos
      tokenManager.clear();

      // Guardar token y usuario
      tokenManager.setToken(data.token);
      tokenManager.setUser(user);

      // 🔍 NUEVO LOG: Verificar que el token guardado es el mismo que se recibió
      console.log(
        '🔍 ¿El token guardado es igual al recibido?',
        tokenManager.getToken() === data.token,
      );

      console.log('✅ Saved to localStorage:', {
        token: tokenManager.getToken(),
        user: tokenManager.getUser(),
      });

      return {
        user,
        token: data.token,
      };
    } catch (error) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: number;
    department?: string;
    position?: string;
  }): Promise<void> => {
    try {
      const token = tokenManager.getToken();
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('❌ Register service error:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const token = tokenManager.getToken();

      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Primero intentar obtener del localStorage
      const cachedUser = tokenManager.getUser();
      if (cachedUser) {
        console.log('🔍 Using cached user:', cachedUser);
        return cachedUser;
      }

      // Si no hay usuario en cache, obtener del backend
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Si el token es inválido, limpiar storage
        tokenManager.clear();
        throw new Error('Token inválido');
      }

      const data: UserResponse = await response.json();
      const user = mapBackendUserToUser(data.user);

      // Actualizar cache
      tokenManager.setUser(user);

      return user;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = tokenManager.getToken();

      if (token) {
        // Intentar hacer logout en el backend
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.warn('⚠️ Error en logout del backend:', error);
          // Continuar con el logout local aunque falle el backend
        }
      }

      // Limpiar storage local
      tokenManager.clear();
      console.log('✅ Logout completed, storage cleared');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Asegurar que se limpie el storage aunque haya error
      tokenManager.clear();
    }
  },

  isAuthenticated: (): boolean => {
    const token = tokenManager.getToken();
    const user = tokenManager.getUser();
    return !!(token && user);
  },

  // Método para probar la conexión con el backend
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/test`);
      return response.ok;
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      return false;
    }
  },
};
