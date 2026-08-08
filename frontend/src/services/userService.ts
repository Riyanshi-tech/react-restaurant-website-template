import api from './api';
import { User, UserRole } from '../types';

export interface UserInput {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive?: boolean;
  permissions?: string[];
}

export const userService = {
  async getUsers() {
    const response = await api.get<{ data: { users: User[] } }>('/users');
    return response.data.data.users;
  },

  async createUser(data: UserInput) {
    const response = await api.post<{ data: { user: User } }>('/users', data);
    return response.data.data.user;
  },

  async updateUser(id: string, data: Partial<UserInput>) {
    const response = await api.put<{ data: { user: User } }>(`/users/${id}`, data);
    return response.data.data.user;
  },

  async deleteUser(id: string) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async logAccessAs(id: string) {
    const response = await api.post(`/users/${id}/access-as`);
    return response.data;
  }
};
