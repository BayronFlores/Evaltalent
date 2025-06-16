import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../redux/slices/userSlice'; // Ajusta la ruta si es necesario
import type { User } from '../redux/slices/userSlice'; // Ajusta la ruta si es necesario
import type { RootState } from '../redux/store'; // Asegúrate que la ruta sea correcta

const UsersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Simulación de carga de usuarios (puede reemplazarse por una API real)
    const mockUsers: User[] = [
      { id: '1', nombre: 'Admin', email: 'admin@example.com', rol: 'admin' },
      {
        id: '2',
        nombre: 'Evaluador',
        email: 'eval@example.com',
        rol: 'evaluador',
      },
      {
        id: '3',
        nombre: 'Empleado',
        email: 'empleado@example.com',
        rol: 'empleado',
      },
    ];
    dispatch(setUsers(mockUsers));
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <p className="text-gray-600 mb-6">
        Gestión de usuarios del sistema (administradores, evaluadores,
        empleados).
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="py-2 px-4 border">{user.nombre}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border capitalize">{user.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
