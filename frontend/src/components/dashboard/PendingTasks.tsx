import React from 'react';
import type { Evaluation } from '../../types/EvaluationType';

const PendingTasks: React.FC = () => {
  // Ejemplo de uso de las interfaces
  const pendingEvaluations: Evaluation[] = [
    {
      id: '1',
      title: 'Evaluar desempeño de María López',
      description: 'Evaluación de desempeño Q2',
      evaluatorId: 'manager1',
      evaluatedId: 'employee1',
      cycleId: 'cycle1',
      status: 'pending',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      responses: [],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Tareas Pendientes</h2>
      <ul className="list-disc list-inside space-y-1">
        {pendingEvaluations.map((evaluation) => (
          <li key={evaluation.id}>{evaluation.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PendingTasks;
