import { tokenManager } from './tokenManager';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  request: async (url: string, options?: RequestInit): Promise<Response> => {
    const token = tokenManager.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...(options?.headers || {}),
      },
    });
  },

  // Métodos HTTP auxiliares
  get: async (url: string) => {
    const res = await apiClient.request(url, { method: 'GET' });
    return res.json();
  },

  post: async (url: string, data: any) => {
    const res = await apiClient.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  put: async (url: string, data: any) => {
    const res = await apiClient.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (url: string) => {
    const res = await apiClient.request(url, { method: 'DELETE' });
    return res.json();
  },

  getBlob: async (url: string, options?: RequestInit) => {
    const res = await apiClient.request(url, {
      method: 'GET',
      cache: 'no-store',
      ...(options || {}),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return {
      data: await res.blob(),
      headers: Object.fromEntries(res.headers.entries()),
    };
  },
};
