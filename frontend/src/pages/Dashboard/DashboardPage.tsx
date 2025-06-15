import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { UserRole } from '../../types/UserType';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">
          {getGreeting()}, {user?.firstName}! 👋
        </h1>
        <p className="text-[#475569] mt-1">
          Aquí tienes un resumen de tu actividad reciente
        </p>
      </div>

      {/* Role-based Dashboard Content */}
      {user?.role === UserRole.ADMIN && <AdminDashboard />}
      {user?.role === UserRole.MANAGER && <ManagerDashboard />}
      {user?.role === UserRole.EMPLOYEE && <EmployeeDashboard />}
    </div>
  );
};

export default DashboardPage;
