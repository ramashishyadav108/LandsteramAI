import { api, ApiResponse } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

class UserService {
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return api.get<User[]>('/api/auth/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return api.get<User>(`/api/auth/users/${id}`);
  }
}

export const userService = new UserService();
