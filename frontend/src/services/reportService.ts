import { apiClient } from './apiClient';

// Obtener tipos de reporte
export const fetchReportTypes = async () => {
  const { data } = await apiClient.get('/reports/types');
  return data;
};

// Obtener lista de reportes
export const fetchReports = async (params: any) => {
  const query = new URLSearchParams(params).toString();
  return await apiClient.get(`/reports?${query}`);
};

// Crear un nuevo reporte
export const createReport = async (payload: any) => {
  const { data } = await apiClient.post('/reports', payload);
  return data;
};

// Exportar reporte (PDF o Excel)
export const exportReport = async (id: number, format: 'pdf' | 'excel') => {
  const response = await apiClient.getBlob(`/reports/${id}/export/${format}`);

  // Verifica el tipo de contenido
  const contentType = response.headers['content-type'];
  if (
    !contentType ||
    (!contentType.includes('pdf') && !contentType.includes('spreadsheet'))
  ) {
    console.warn('Content-Type inesperado:', contentType);
  }

  // Devuelve el blob
  return response.data;
};
