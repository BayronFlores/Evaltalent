const API_BASE_URL = 'http://localhost:5000/api';

const tokenManager = {
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
};

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
};
