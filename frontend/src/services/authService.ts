// src/services/authService.ts
import type { LoginForm, User } from '../types';

// Datos de usuario mock
const mockUser: User = {
  id: '1',
  email: 'employee@example.com',
  firstName: 'Regular',
  lastName: 'Employee',
  role: 'employee',
  department: 'Development',
  position: 'Junior Developer',
  managerId: '2',
  createdAt: new Date('2022-01-01').toISOString(),
  updatedAt: new Date().toISOString(),
};

// Usuario administrador mock
const mockAdmin: User = {
  id: '2',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  department: 'Management',
  position: 'System Administrator',
  managerId: 'jose',
  createdAt: new Date('2021-01-01').toISOString(),
  updatedAt: new Date().toISOString(),
};

// Usuario manager mock
const mockManager: User = {
  id: '3',
  email: 'manager@example.com',
  firstName: 'Manager',
  lastName: 'User',
  role: 'manager',
  department: 'Development',
  position: 'Team Lead',
  managerId: '2',
  createdAt: new Date('2021-06-01').toISOString(),
  updatedAt: new Date().toISOString(),
};

// Storage en memoria (reemplaza localStorage)
const memoryStorage = {
  token: null as string | null,
  user: null as User | null,

  setToken(token: string) {
    this.token = token;
  },

  getToken(): string | null {
    return this.token;
  },

  setUser(user: User) {
    this.user = user;
  },

  getUser(): User | null {
    return this.user;
  },

  clear() {
    this.token = null;
    this.user = null;
  },
};

// Simulamos un token válido
const mockToken = 'mock-jwt-token';

// Credenciales válidas para diferentes roles
const validCredentials = [
  { email: 'demo@example.com', password: 'demo123', user: mockUser },
  { email: 'admin@example.com', password: 'admin123', user: mockAdmin },
  { email: 'manager@example.com', password: 'manager123', user: mockManager },
  { email: 'employee@example.com', password: 'employee123', user: mockUser },
];

export const authService = {
  login: async (
    credentials: LoginForm,
  ): Promise<{ user: User; token: string }> => {
    // Simulamos un retraso de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validación básica
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Verificar credenciales válidas
    const validCredential = validCredentials.find(
      (cred) =>
        cred.email === credentials.email &&
        cred.password === credentials.password,
    );

    if (validCredential) {
      // Guardar en memoria
      memoryStorage.setToken(mockToken);
      memoryStorage.setUser(validCredential.user);

      return {
        user: validCredential.user,
        token: mockToken,
      };
    } else {
      throw new Error('Credenciales inválidas');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    // Simulamos un retraso de red
    await new Promise((resolve) => setTimeout(resolve, 300));

    const token = memoryStorage.getToken();
    const user = memoryStorage.getUser();

    if (!token || !user) {
      throw new Error('No autenticado');
    }

    return user;
  },

  logout: async (): Promise<void> => {
    memoryStorage.clear();
  },

  isAuthenticated: (): boolean => {
    return !!memoryStorage.getToken();
  },

  // Método para obtener todos los usuarios mock (útil para testing)
  getAllUsers: (): User[] => {
    return [mockUser, mockAdmin, mockManager];
  },
};
