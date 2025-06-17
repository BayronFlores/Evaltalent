import { apiClient } from './apiClient';

// Puedes definir tipos más precisos según tu backend
interface RoleData {
  name: string;
  permissions: number[];
}

export const getRoles = async (): Promise<any> => {
  const res = await apiClient.get('/roles');
  return res;
};

export const getPermissions = async (): Promise<any> => {
  const res = await apiClient.get('/roles/permissions');
  return res;
};

export const createRole = async (data: RoleData): Promise<any> => {
  const res = await apiClient.post('/roles', data);
  return res;
};

export const updateRole = async (id: number, data: RoleData): Promise<any> => {
  const res = await apiClient.put(`/roles/${id}`, data);
  return res;
};

export const deleteRole = async (id: number): Promise<any> => {
  const res = await apiClient.delete(`/roles/${id}`);
  return res;
};

export const getRolePermissions = async (id: number): Promise<any> => {
  const res = await apiClient.get(`/roles/${id}/permissions`);
  return res;
};
