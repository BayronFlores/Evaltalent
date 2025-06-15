import { Users, CheckCircle, Clock } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';

const ManagerDashboard = () => {
  return (
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
};

export default ManagerDashboard;
