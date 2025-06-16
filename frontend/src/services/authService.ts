// src/services/authService.ts
import type { User } from '../types/UserType';
import type { LoginForm } from '../types/FormType';

const API_BASE_URL = 'http://localhost:5000/api';

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
    department: string;
    position: string;
    role: string;
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
const mapBackendUserToUser = (backendUser: LoginResponse['user']): User => {
  return {
    id: backendUser.id.toString(),
    email: backendUser.email,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    role: backendUser.role as 'admin' | 'manager' | 'employee',
    department: backendUser.department,
    position: backendUser.position,
    managerId: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Gestión de tokens
const tokenManager = {
  setToken(token: string) {
    localStorage.setItem('authToken', token);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeToken() {
    localStorage.removeItem('authToken');
  },

  setUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser() {
    localStorage.removeItem('currentUser');
  },

  clear() {
    this.removeToken();
    this.removeUser();
  },
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
      console.log('✅ Login successful:', data);

      // Mapear usuario del backend al formato del frontend
      const user = mapBackendUserToUser(data.user);

      // Guardar token y usuario
      tokenManager.setToken(data.token);
      tokenManager.setUser(user);

      return {
        user,
        token: data.token,
      };
    } catch (error) {
      console.error('❌ Login service error:', error);
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
