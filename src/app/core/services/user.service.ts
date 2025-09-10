import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { User, UserRole } from '../../shared/models';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface CreateUserResponse {
  name: string;
  email: string;
  role: UserRole;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {}

  /**
   * Registrar um novo usuário
   */
  registerUser(userData: CreateUserRequest): Observable<ApiResponse<CreateUserResponse>> {
    return this.apiService.post<ApiResponse<CreateUserResponse>>('/auth/register', userData);
  }

  /**
   * Buscar todos os usuários
   * GET /auth/users
   */
  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/auth/users');
  }

  /**
   * Buscar usuário por ID
   * GET /auth/users/{user_id}
   */
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/auth/users/${id}`);
  }

  /**
   * Atualizar usuário
   * PUT /auth/users/{user_id}
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.apiService.put<User>(`/auth/users/${id}`, userData);
  }

  /**
   * Excluir usuário
   * DELETE /auth/users/{user_id}
   */
  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`/auth/users/${id}`);
  }
}
