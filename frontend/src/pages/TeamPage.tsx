// src/pages/TeamPage.tsx
import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { tokenManager } from '../services/tokenManager';
import type { User } from '../types/UserType';

const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);

        // Debug: Verifica el usuario actual
        console.log('🔍 Usuario actual:', tokenManager.getUser());
        console.log('🔍 Token actual:', tokenManager.getToken());

        const teamData = await userService.getTeam();
        console.log('Equipo recibido:', teamData);

        setTeam(teamData);
      } catch (err) {
        setError('Error al cargar el equipo');
        console.error('❌ Error al cargar equipo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) return <div>Cargando equipo...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mi equipo</h2>

      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <strong>Usuario actual:</strong> {tokenManager.getUser()?.firstName}{' '}
        {tokenManager.getUser()?.lastName} (ID: {tokenManager.getUserId()})
      </div>

      {team.length === 0 ? (
        <p>No tienes empleados a tu cargo.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Departamento</th>
              <th className="px-4 py-2 border">Puesto</th>
              <th className="px-4 py-2 border">Fecha de ingreso</th>
            </tr>
          </thead>
          <tbody>
            {team.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.firstName}</td>
                <td className="px-4 py-2 border">{user.lastName}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.department}</td>
                <td className="px-4 py-2 border">{user.position}</td>
                <td className="px-4 py-2 border">{user.hireDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeamPage;
