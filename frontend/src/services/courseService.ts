import API_BASE_URL from '../config/api';
import { tokenManager } from './tokenManager';

export interface Curso {
  id: number;
  title: string;
  progress: number;
  status: string;
  link: string;
}

const getAuthHeaders = () => {
  const token = tokenManager.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const courseService = {
  getCourses: async (): Promise<Curso[]> => {
    const response = await fetch(`${API_BASE_URL}/course/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error fetching courses');
    }
    return response.json();
  },

  updateCourse: async (
    id: number,
    progress: number,
    status: string,
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/course/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress, status }),
    });
    if (!response.ok) {
      throw new Error('Error updating course');
    }
  },
};
