import React, { useEffect, useState } from 'react';
import {
  fetchReportTypes,
  fetchReports,
  createReport,
  exportReport,
} from '../services/reportService';

const ReportsPage: React.FC = () => {
  const [reportTypes, setReportTypes] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [filters] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Cargar tipos de reporte
  useEffect(() => {
    fetchReportTypes()
      .then((data) => setReportTypes(data || []))
      .catch(() => setReportTypes([]));
    fetchReports({})
      .then(setReports)
      .catch(() => setReports([]));
  }, []);

  // Generar un nuevo reporte
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        name: `Reporte - ${
          reportTypes.find((t) => t.value === selectedType)?.label ||
          selectedType
        }`,
        type: selectedType,
        filters,
      };
      await createReport(payload);
      const updated = await fetchReports({});
      setReports(updated);
      alert('Reporte generado correctamente');
    } catch (e) {
      alert('Error al generar el reporte');
    }
    setLoading(false);
  };

  console.log('reports:', reports);
  // Descargar reporte
  const handleExport = async (id: number, format: 'pdf' | 'excel') => {
    try {
      const blob = await exportReport(id, format);
      const url = window.URL.createObjectURL(blob); // Usa el blob directamente
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `reporte.${format === 'pdf' ? 'pdf' : 'xlsx'}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Libera memoria ✅ Liberar memoria
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el reporte');
    }
  };

  return (
    <div>
      <h2>Reportes</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          Tipo de reporte:&nbsp;
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Seleccione...</option>
            {Array.isArray(reportTypes) &&
              reportTypes.map((rt) => (
                <option key={rt.value} value={rt.value}>
                  {rt.label}
                </option>
              ))}
            {Array.isArray(reportTypes) && reportTypes.length === 0 && (
              <option disabled value="">
                No hay tipos de reporte
              </option>
            )}
          </select>
        </label>
        {/* Puedes agregar aquí inputs para filtros adicionales */}
        <button onClick={handleGenerate} disabled={!selectedType || loading}>
          {loading ? 'Generando...' : 'Generar reporte'}
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(reports) && reports.length > 0 ? (
            reports.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {r.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {r.generated_by_name || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {r.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExport(r.id, 'pdf')}
                      className="text-red-600 hover:text-red-900"
                      title="Exportar PDF"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleExport(r.id, 'excel')}
                      className="text-green-600 hover:text-green-900"
                      title="Exportar Excel"
                    >
                      Excel
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No hay reportes disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;
