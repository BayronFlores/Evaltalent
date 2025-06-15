import React from 'react';
import type { Evaluation } from '../../types/EvaluationType'; // Ajusta la ruta según tu estructura

const RecentEvaluations: React.FC = () => {
  // Ejemplo de uso de las interfaces
  const evaluations: Evaluation[] = [
    {
      id: '1',
      title: 'Evaluación de Juan Pérez',
      description: 'Evaluación Q1',
      evaluatorId: 'manager1',
      evaluatedId: 'employee1',
      cycleId: 'cycle1',
      status: 'completed',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      responses: [],
      overallScore: 88,
      createdAt: '2025-06-01',
      updatedAt: '2025-06-01',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Evaluaciones Recientes</h2>
      <ul className="space-y-2">
        {evaluations.map((evaluation) => (
          <li key={evaluation.id} className="flex justify-between">
            <span>{evaluation.title}</span>
            <span className="text-sm text-gray-500">
              {new Date(evaluation.createdAt).toLocaleDateString()}
            </span>
            <span className="font-bold">{evaluation.overallScore}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentEvaluations;
