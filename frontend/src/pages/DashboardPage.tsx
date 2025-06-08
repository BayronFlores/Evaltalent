function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Aquí irá la visualización de métricas.
      </p>
    </div>
  );
}
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { UserRole } from '../types';
import {
  Users,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

// Import dashboard components
import StatsCard from '../components/dashboard/StatsCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import RecentEvaluations from '../components/dashboard/RecentEvaluations';
import PendingTasks from '../components/dashboard/PendingTasks';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  // const { stats, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    // Dispatch action to load dashboard data
    // dispatch(loadDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    console.log('Usuario cargado:', user);
  }, [user]);

  // Mock data for demonstration
  const mockStats = {
    totalEmployees: 150,
    activeEvaluations: 25,
    completedEvaluations: 85,
    averageScore: 4.2,
    pendingEvaluations: 12,
    overdueEvaluations: 3,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Empleados"
          value={mockStats.totalEmployees}
          change={5.2}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Evaluaciones Activas"
          value={mockStats.activeEvaluations}
          change={-2.1}
          icon={ClipboardList}
          color="green"
        />
        <StatsCard
          title="Promedio General"
          value={mockStats.averageScore}
          change={8.3}
          icon={TrendingUp}
          color="purple"
          format="decimal"
        />
        <StatsCard
          title="Pendientes"
          value={mockStats.pendingEvaluations}
          change={-15.2}
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <RecentEvaluations />
      </div>

      {/* Pending Tasks */}
      <PendingTasks />
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Mi Equipo"
          value={12}
          change={0}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Evaluaciones Completadas"
          value={8}
          change={14.3}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Pendientes de Revisar"
          value={4}
          change={-25.0}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Manager specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-[#0f172a] mb-4">
            Evaluaciones de Mi Equipo
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg"
              >
                <div>
                  <p className="font-medium text-[#0f172a]">Juan Pérez</p>
                  <p className="text-sm text-[#475569]">Evaluación Q1 2024</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-[#0f172a] mb-4">
            Rendimiento del Equipo
          </h3>
          <div className="space-y-4">
            {['Excelente', 'Bueno', 'Regular', 'Necesita Mejora'].map(
              (level, index) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm text-[#475569]">{level}</span>
                  <div className="flex-1 mx-3 bg-[#e2e8f0] rounded-full h-2">
                    <div
                      className="bg-[#0284c7] h-2 rounded-full"
                      style={{ width: `${[60, 25, 10, 5][index]}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#0f172a]">
                    {[60, 25, 10, 5][index]}%
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeDashboard = () => (
    <div className="space-y-6">
      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Mi Puntuación"
          value={4.5}
          change={12.5}
          icon={TrendingUp}
          color="green"
          format="decimal"
        />
        <StatsCard
          title="Evaluaciones Completadas"
          value={3}
          change={0}
          icon={CheckCircle}
          color="blue"
        />
        <StatsCard
          title="Objetivos Cumplidos"
          value={85}
          change={5.2}
          icon={Users}
          color="purple"
          suffix="%"
        />
      </div>

      {/* Personal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-[#0f172a] mb-4">
            Mi Progreso
          </h3>
          <div className="space-y-4">
            {[
              { skill: 'Liderazgo', progress: 85 },
              { skill: 'Comunicación', progress: 92 },
              { skill: 'Trabajo en Equipo', progress: 78 },
              { skill: 'Resolución de Problemas', progress: 88 },
            ].map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[#334155]">
                    {item.skill}
                  </span>
                  <span className="text-sm text-[#64748b]">
                    {item.progress}%
                  </span>
                </div>
                <div className="w-full bg-[#e2e8f0] rounded-full h-2">
                  <div
                    className="bg-[#0284c7] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-[#0f172a] mb-4">
            Próximas Evaluaciones
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-[#f0f9ff] rounded-lg border border-[#bae6fd]">
              <Clock className="w-5 h-5 text-[#0284c7] mr-3" />
              <div>
                <p className="font-medium text-[#0c4a6e]">Autoevaluación Q2</p>
                <p className="text-sm text-[#0284c7]">Vence en 5 días</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-[#f8fafc] rounded-lg">
              <Clock className="w-5 h-5 text-[#475569] mr-3" />
              <div>
                <p className="font-medium text-[#0f172a]">Evaluación 360°</p>
                <p className="text-sm text-[#475569]">Vence en 15 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      {user?.role === UserRole.ADMIN && renderAdminDashboard()}
      {user?.role === UserRole.MANAGER && renderManagerDashboard()}
      {user?.role === UserRole.EMPLOYEE && renderEmployeeDashboard()}
    </div>
  );
};

export default DashboardPage;
export { Dashboard };
