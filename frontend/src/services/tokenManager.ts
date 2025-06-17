import type { User } from '../types/UserType';

export const tokenManager = {
  setToken(token: string) {
    localStorage.setItem('authToken', token);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeToken() {
    localStorage.removeItem('authToken');
  },

  setUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser() {
    localStorage.removeItem('currentUser');
  },

  clear() {
    this.removeToken();
    this.removeUser();
  },
};
