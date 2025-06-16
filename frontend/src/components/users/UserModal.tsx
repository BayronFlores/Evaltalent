// src/components/users/UserModal.tsx
import React, { useState, useEffect } from 'react';
import type {
  Role,
  CreateUserData,
  UpdateUserData,
  User,
} from '../../types/UserType';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  roles: Role[];
  onSave: (userData: CreateUserData | UpdateUserData) => Promise<void>;
  loading: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: 3,
    department: '',
    position: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        department: user.department || '',
        position: user.position || '',
        isActive: user.isActive,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        roleId: 3,
        department: '',
        position: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = 'Usuario es requerido';
    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    if (!formData.firstName.trim()) newErrors.firstName = 'Nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
    if (!user && !formData.password.trim())
      newErrors.password = 'Contraseña es requerida';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (user) {
      const updateData: UpdateUserData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleId: formData.roleId,
        department: formData.department,
        position: formData.position,
        isActive: formData.isActive,
      };
      onSave(updateData);
    } else {
      const createData: CreateUserData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleId: formData.roleId,
        department: formData.department,
        position: formData.position,
      };
      onSave(createData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Botón cerrar (X) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">
          {user ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium">Usuario</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          {!user && (
            <div>
              <label className="block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                className="mt-1 block w-full border rounded-md p-2"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium">Apellido</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium">Rol</label>
            <select
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.roleId}
              onChange={(e) =>
                setFormData({ ...formData, roleId: parseInt(e.target.value) })
              }
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium">Departamento</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-medium">Cargo</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
          </div>

          {/* Activo (checkbox) */}
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <label>Usuario Activo</label>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
