import React from 'react';
import { Search } from 'lucide-react';
import type { Role } from '../../types/UserType';

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  roles: Role[];
  filteredCount: number;
  totalCount: number;
}

const UsersFilters: React.FC<UsersFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  roles,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos los roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>

      <div className="flex items-center text-sm text-gray-600">
        {filteredCount} de {totalCount} usuarios
      </div>
    </div>
  );
};

export default UsersFilters;
