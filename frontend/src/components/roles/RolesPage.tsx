import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import RoleModal from './RoleModal';
import { getRoles, deleteRole } from '../../services/roleService';
import type { Role } from '../../types/UserType';

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch (error: any) {
      // Agregado el tipo 'any' para el error
      console.error('Error fetching roles:', error);
      setError(error.message || 'Error al cargar los roles'); // Muestra el mensaje del backend
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setOpenModal(true);
  };

  const handleDelete = async (roleId: number) => {
    if (window.confirm('¿Seguro que quieres eliminar este rol?')) {
      try {
        await deleteRole(roleId);
        await fetchRoles();
      } catch (error: any) {
        // Agregado el tipo 'any' para el error
        console.error('Error deleting role:', error);
        setError(error.message || 'Error al eliminar el rol'); // Muestra el mensaje del backend
      }
    }
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setOpenModal(true);
  };

  if (loading) {
    return <div className="p-6">Cargando roles...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Gestión de Roles
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreate}
        className="mb-4"
      >
        Crear nuevo rol
      </Button>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded-lg mt-5">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left border-b">Nombre</th>
              <th className="px-4 py-2 text-left border-b">Descripción</th>
              <th className="px-4 py-2 text-left border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No hay roles disponibles
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{role.name}</td>
                  <td className="px-4 py-2 border-b">{role.description}</td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <Button
                      onClick={() => handleEdit(role)}
                      variant="outlined"
                      color="primary"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(role.id)}
                      variant="outlined"
                      color="secondary"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RoleModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        role={selectedRole}
        onSaved={fetchRoles}
      />
    </div>
  );
};

export default RolesPage;
