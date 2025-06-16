// src/components/users/UsersHeader.tsx
import React from 'react';
import { Plus } from 'lucide-react';

interface UsersHeaderProps {
  onCreate: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ onCreate }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Administra usuarios y sus roles en el sistema
        </p>
      </div>
      <button
        onClick={onCreate}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nuevo Usuario
      </button>
    </div>
  );
};

export default UsersHeader;
