import React from 'react';
import type { Evaluation } from '../types/EvaluationType';
import { EvaluationStatus } from '../types/EvaluationType';

const EvaluationsPage: React.FC = () => {
  // Ejemplo de uso de las interfaces
  const evaluations: Evaluation[] = [
    {
      id: '1',
      title: 'Evaluación Q1',
      description: 'Evaluación de desempeño Q1',
      evaluatorId: 'manager1',
      evaluatedId: 'employee1',
      cycleId: 'cycle1',
      status: EvaluationStatus.PENDING,
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      responses: [],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Evaluaciones</h1>
      <p className="text-gray-600">
        Aquí se listan y gestionan las evaluaciones laborales.
      </p>
      {/* Mostrar las evaluaciones */}
      <div>
        {evaluations.map((evaluation) => (
          <div key={evaluation.id}>
            <h2>{evaluation.title}</h2>
            <p>Estado: {evaluation.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationsPage;
