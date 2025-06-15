import { Users, ClipboardList, TrendingUp, AlertTriangle } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import RecentEvaluations from '../../components/dashboard/RecentEvaluations';
import PendingTasks from '../../components/dashboard/PendingTasks';
import type { DashboardStats } from '../../types/DashboardType'; // Importa el tipo

const AdminDashboard = () => {
  // Mock data for demonstration
  const mockStats: DashboardStats = {
    // Aplica el tipo aquí
    totalEmployees: 150,
    activeEvaluations: 25,
    completedEvaluations: 85,
    averageScore: 4.2,
    pendingEvaluations: 12,
    overdueEvaluations: 3,
  };

  return (
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
};

export default AdminDashboard;
