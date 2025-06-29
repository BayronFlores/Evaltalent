import API_BASE_URL from '../config/api';
import { tokenManager } from './tokenManager';

const getAuthHeaders = () => {
  const token = tokenManager.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const getAuthHeadersWithoutContentType = () => {
  const token = tokenManager.getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const evaluationService = {
  getEvaluations: async () => {
    const response = await fetch(`${API_BASE_URL}/evaluations`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener evaluaciones');
    return response.json();
  },

  createEvaluation: async (evaluationData: any) => {
    const response = await fetch(`${API_BASE_URL}/evaluations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear evaluación');
    }
    return response.json();
  },

  updateEvaluation: async (id: string, evaluationData: any) => {
    const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar evaluación');
    }
    return response.json();
  },

  deleteEvaluation: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar evaluación');
    }
  },

  getMyResults: async () => {
    const response = await fetch(`${API_BASE_URL}/evaluations/my-results`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error fetching evaluations');
    }
    return response.json();
  },

  saveProgress: async (evaluationId: string, formData: FormData) => {
    const response = await fetch(
      `${API_BASE_URL}/evaluations/${evaluationId}/progress`,
      {
        method: 'PATCH',
        headers: getAuthHeadersWithoutContentType(), // No Content-Type aquí
        body: formData,
      },
    );
    if (!response.ok) throw new Error('Error guardando progreso');
    return response.json();
  },

  submitEvaluation: async (evaluationId: string, formData: FormData) => {
    const response = await fetch(
      `${API_BASE_URL}/evaluations/${evaluationId}`,
      {
        method: 'PUT',
        headers: getAuthHeadersWithoutContentType(), // No Content-Type aquí
        body: formData,
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error enviando evaluación');
    }
    return response.json();
  },
};
