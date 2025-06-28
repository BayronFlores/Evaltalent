import { Users, CheckCircle, Clock } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import { NavLink } from 'react-router-dom';

const teamMembers = [
  {
    id: 1,
    name: 'Ana García',
    position: 'Desarrolladora Senior',
    status: 'completed',
    score: 4.5,
  },
  {
    id: 2,
    name: 'Carlos López',
    position: 'Diseñador UX',
    status: 'pending',
    score: null,
  },
  {
    id: 3,
    name: 'María Rodríguez',
    position: 'QA Analyst',
    status: 'in_progress',
    score: null,
  },
  {
    id: 4,
    name: 'Juan Pérez',
    position: 'Backend Developer',
    status: 'completed',
    score: 4.2,
  },
  {
    id: 5,
    name: 'Laura Martín',
    position: 'Frontend Developer',
    status: 'overdue',
    score: null,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200 px-2 py-1 rounded-full text-xs font-medium border';
    case 'in_progress':
      return 'bg-blue-100 text-blue-700 border-blue-200 px-2 py-1 rounded-full text-xs font-medium border';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 px-2 py-1 rounded-full text-xs font-medium border';
    case 'overdue':
      return 'bg-red-100 text-red-700 border-red-200 px-2 py-1 rounded-full text-xs font-medium border';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 px-2 py-1 rounded-full text-xs font-medium border';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completada';
    case 'in_progress':
      return 'En Progreso';
    case 'pending':
      return 'Pendiente';
    case 'overdue':
      return 'Vencida';
    default:
      return status;
  }
};

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
      <div className="rounded-lg border bg-white text-gray-900 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Mi Equipo
          </h3>
          <p className="text-sm text-gray-600">
            Estado actual de evaluaciones por miembro
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {member.score && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {member.score}/5
                      </p>
                      <p className="text-xs text-gray-500">Puntuación</p>
                    </div>
                  )}
                  <span className={getStatusColor(member.status)}>
                    {getStatusText(member.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <NavLink
              to="/manager/Team"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver Todo el Equipo
            </NavLink>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Rendimiento del Equipo
        </h3>
        <div className="space-y-4">
          {['Excelente', 'Bueno', 'Regular', 'Necesita Mejora'].map(
            (level, index) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{level}</span>
                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${[60, 25, 10, 5][index]}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {[60, 25, 10, 5][index]}%
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
