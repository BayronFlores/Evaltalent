import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { UserRole } from '../../types/UserType';
import { setDashboardData } from '../../redux/slices/dashboardSlice';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useSelector((state: RootState) => state.dashboard);

  // Cargar datos del dashboard
  useEffect(() => {
    const fetchData = async () => {
      // Aquí iría la llamada real a la API
      const mockData = {
        evaluacionesCompletadas: 5,
        evaluacionesPendientes: 3,
        promedioDesempeño: 4.2,
      };
      dispatch(setDashboardData(mockData));
    };

    fetchData();
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">
          {getGreeting()}, {user?.firstName}! 👋
        </h1>
        <p className="text-[#475569] mt-1">
          Aquí tienes un resumen de tu actividad reciente
        </p>
        {/* Mostramos métricas si están disponibles */}
        <div className="mt-4 text-sm text-gray-700">
          <p>Evaluaciones completadas: {data.evaluacionesCompletadas}</p>
          <p>Evaluaciones pendientes: {data.evaluacionesPendientes}</p>
          <p>Promedio de desempeño: {data.promedioDesempeño}</p>
        </div>
      </div>

      {/* Renderizado condicional por rol */}
      {user?.role === UserRole.ADMIN && <AdminDashboard />}
      {user?.role === UserRole.MANAGER && <ManagerDashboard />}
      {user?.role === UserRole.EMPLOYEE && <EmployeeDashboard />}
    </div>
  );
};

export default DashboardPage;
