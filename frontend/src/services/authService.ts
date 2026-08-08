import api from './api';
import { LoginCredentials, AuthResponse, UserProfileResponse } from '../types';

export const authService = {
  /**
   * Logs in a user
   * @param credentials - User email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logs out the user and clears cookie
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Retrieves the current user's session profile
   */
  async getMe(): Promise<UserProfileResponse> {
    const response = await api.get<UserProfileResponse>('/auth/me');
    return response.data;
  }
};
