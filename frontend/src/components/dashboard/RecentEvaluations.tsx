import React from 'react';

const RecentEvaluations: React.FC = () => {
  const evaluations = [
    { name: 'Juan Pérez', score: 88, date: '2025-06-01' },
    { name: 'Ana Gómez', score: 91, date: '2025-05-28' },
    { name: 'Luis Torres', score: 76, date: '2025-05-25' },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Evaluaciones Recientes</h2>
      <ul className="space-y-2">
        {evaluations.map((evalItem, index) => (
          <li key={index} className="flex justify-between">
            <span>{evalItem.name}</span>
            <span className="text-sm text-gray-500">{evalItem.date}</span>
            <span className="font-bold">{evalItem.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentEvaluations;
