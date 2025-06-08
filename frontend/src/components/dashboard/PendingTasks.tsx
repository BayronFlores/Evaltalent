import React from 'react';

const PendingTasks: React.FC = () => {
  const tasks = [
    'Evaluar desempeño de María López',
    'Revisar ciclo de evaluación Q2',
    'Generar reporte PDF para equipo de ventas',
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Tareas Pendientes</h2>
      <ul className="list-disc list-inside space-y-1">
        {tasks.map((task, idx) => (
          <li key={idx}>{task}</li>
        ))}
      </ul>
    </div>
  );
};

export default PendingTasks;
