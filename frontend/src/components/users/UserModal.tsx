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
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {user ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Aquí irían los inputs reales para cada campo */}
          {/* Ej: input para nombre, email, password, etc. */}
        </form>
      </div>
    </div>
  );
};

export default UserModal;
