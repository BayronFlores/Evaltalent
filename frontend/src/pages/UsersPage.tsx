import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type {
  User,
  Role,
  CreateUserData,
  UpdateUserData,
} from '../types/UserType';
import UsersHeader from '../components/users/UsersHeader';
import UsersFilters from '../components/users/UsersFilters';
import UsersTable from '../components/users/UsersTable';
import UserModal from '../components/users/UserModal';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getUsers(),
        userService.getRoles(),
      ]);
      console.log('Roles cargados:', rolesData); // <-- Aquí
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      setError('Error al cargar datos');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTermLower) ||
      user.lastName.toLowerCase().includes(searchTermLower) ||
      user.username.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower);

    // Si user.role es string:
    const matchesRole = !roleFilter || user.role === roleFilter;

    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      setModalLoading(true);

      // Agregar hire_date con fecha y hora actual
      const userDataWithHireDate = {
        ...userData,
        hire_date: new Date().toISOString(),
      };

      const newUser = await userService.createUser(userDataWithHireDate);
      setUsers([newUser, ...users]);
      setIsModalOpen(false);
      setSuccess('Usuario creado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Error al crear usuario');
      setTimeout(() => setError(''), 3000);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateUser = async (userData: UpdateUserData) => {
    if (!editingUser) return;

    try {
      setModalLoading(true);
      const updatedUser = await userService.updateUser(
        editingUser.id,
        userData,
      );
      setUsers(
        users.map((user) => (user.id === editingUser.id ? updatedUser : user)),
      );
      setIsModalOpen(false);
      setEditingUser(null);
      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Error al actualizar usuario');
      setTimeout(() => setError(''), 3000);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveUser = async (userData: CreateUserData | UpdateUserData) => {
    if (editingUser) {
      await handleUpdateUser(userData as UpdateUserData);
    } else {
      await handleCreateUser(userData as CreateUserData);
    }
  };

  const handleDeactivateUser = async (user: User) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres desactivar al usuario ${user.username}?`,
      )
    ) {
      return;
    }

    try {
      await userService.deleteUser(user.id); // Soft delete en backend
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, isActive: false } : u)),
      );
      setSuccess('Usuario desactivado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Error al desactivar usuario');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar permanentemente al usuario ${user.username}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    try {
      await userService.deleteUserPermanently(user.id);
      setUsers(users.filter((u) => u.id !== user.id));
      setSuccess('Usuario eliminado permanentemente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Error al eliminar usuario');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <UsersHeader onCreate={openCreateModal} />

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roles={roles}
        filteredCount={filteredUsers.length}
        totalCount={users.length}
      />

      <UsersTable
        users={filteredUsers}
        onEdit={openEditModal}
        onDeactivate={handleDeactivateUser}
        onDelete={handleDeleteUser}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        roles={roles}
        onSave={handleSaveUser}
        loading={modalLoading}
      />
    </div>
  );
};

export default UsersPage;
