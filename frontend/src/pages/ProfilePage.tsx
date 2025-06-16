import React, { useEffect, useState } from 'react';
import type { User } from '../types/UserType';
import { authService } from '../services/authService';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-6">No se encontró el usuario</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">{user.position}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Información Personal</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Departamento:</span>{' '}
                {user.department}
              </p>
              <p>
                <span className="font-medium">Rol:</span> {user.role}
              </p>
              <p>
                <span className="font-medium">Fecha de creación:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Información Laboral</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Cargo:</span> {user.position}
              </p>
              <p>
                <span className="font-medium">Manager ID:</span>{' '}
                {user.managerId || 'No asignado'}
              </p>
              <p>
                <span className="font-medium">Última actualización:</span>{' '}
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
