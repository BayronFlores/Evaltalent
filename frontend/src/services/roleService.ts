import API_BASE_URL from '../config/api';

import { tokenManager } from './tokenManager';

const getToken = () => tokenManager.getToken();

// Función helper para manejar respuestas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.json(); // Cambiado a .json() para leer el mensaje del backend
    throw new Error(
      `HTTP ${response.status}: ${errorText.message || 'Error desconocido'}`,
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    throw new Error('Response is not JSON');
  }
};

// Función helper para hacer requests con token
const makeRequest = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return handleResponse(response);
};

export const getRoles = async () => {
  try {
    return await makeRequest('/roles');
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error; // Re-lanza el error para que RolesPage lo capture
  }
};

export const getPermissions = async () => {
  try {
    return await makeRequest('/roles/permissions');
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error; // Re-lanza el error para que RoleModal lo capture
  }
};

export const getRolePermissions = async (roleId: number) => {
  try {
    return await makeRequest(`/roles/${roleId}/permissions`);
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error; // Re-lanza el error
  }
};

export const createRole = async (roleData: any) => {
  return await makeRequest('/roles', {
    method: 'POST',
    body: JSON.stringify(roleData),
  });
};

export const updateRole = async (roleId: number, roleData: any) => {
  return await makeRequest(`/roles/${roleId}`, {
    method: 'PUT',
    body: JSON.stringify(roleData),
  });
};

export const deleteRole = async (roleId: number) => {
  return await makeRequest(`/roles/${roleId}`, {
    method: 'DELETE',
  });
};
