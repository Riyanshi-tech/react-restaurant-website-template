export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
