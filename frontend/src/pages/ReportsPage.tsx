import React from 'react';
import type { Report } from '../types/ReportType';
import { ReportType } from '../types/ReportType';

const ReportsPage: React.FC = () => {
  // Ejemplo de uso de las interfaces
  const reports: Report[] = [
    {
      id: '1',
      title: 'Reporte de Desempeño Q1',
      type: ReportType.DEPARTMENT,
      departmentId: 'dept1',
      data: {},
      generatedBy: 'admin1',
      createdAt: '2025-01-01',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      <p className="text-gray-600">
        Visualización de reportes y resultados agregados de las evaluaciones.
      </p>
      {/* Mostrar los reportes */}
      <div>
        {reports.map((report) => (
          <div key={report.id}>
            <h2>{report.title}</h2>
            <p>Tipo: {report.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
