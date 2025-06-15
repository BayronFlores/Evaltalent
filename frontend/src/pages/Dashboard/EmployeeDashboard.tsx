import { TrendingUp, CheckCircle, Users, Clock } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';

const EmployeeDashboard = () => {
  return (
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
};

export default EmployeeDashboard;
