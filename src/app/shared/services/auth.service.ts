import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserProfile, UserRole } from '../models';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Fazer login
   */
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.apiService.post<LoginResponse>('/auth/login', credentials).pipe(
      map(response => {

        // Verificar se a resposta já está no formato ApiResponse
        if ('success' in response && 'data' in response) {
          return response as ApiResponse<LoginResponse>;
        }

        // Se não estiver, converter para o formato esperado
        const apiResponse: ApiResponse<LoginResponse> = {
          success: true,
          data: response,
          message: 'Login realizado com sucesso'
        };
        return apiResponse;
      }),
      tap(response => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  /**
   * Configurar sessão após login bem-sucedido
   */
  private setSession(loginData: LoginResponse): void {
    // Salvar token
    if (loginData.access_token) {
      localStorage.setItem(this.tokenKey, loginData.access_token);
    }

    // Criar perfil do usuário a partir da resposta do login
    const userProfile: UserProfile = {
      id: 'user', // ID genérico, pode ser obtido do token JWT se necessário
      name: 'Usuário', // Nome genérico, pode ser obtido do token JWT se necessário
      role: loginData.role === 'ADMIN' ? UserRole.ADMIN : UserRole.USER,
      avatar: undefined
    };

    // Salvar dados do usuário
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
    this.currentUserSubject.next(userProfile);
  }

  /**
   * Carregar usuário do localStorage na inicialização
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userProfile = localStorage.getItem('user_profile');

    if (token && userProfile) {
      try {
        const user: UserProfile = JSON.parse(userProfile);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.clearSession();
      }
    }
  }

  /**
   * Fazer logout
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Limpar sessão
   */
  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user_profile');
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const user = this.currentUserSubject.value;
    return !!(token && user);
  }

  /**
   * Obter token atual
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar se usuário é admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }

  /**
   * Verificar se usuário é user comum
   */
  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.USER;
  }

  /**
   * Verificar se usuário tem uma role específica
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Obter perfil do usuário logado via API
   */
  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.apiService.get<UserProfile>('/auth/me').pipe(
      map(response => {
        // Verificar se a resposta já está no formato ApiResponse
        if ('success' in response && 'data' in response) {
          return response as ApiResponse<UserProfile>;
        }

        // Se não estiver, converter para o formato esperado
        const apiResponse: ApiResponse<UserProfile> = {
          success: true,
          data: response as UserProfile,
          message: 'Perfil obtido com sucesso'
        };
        return apiResponse;
      }),
      tap(response => {
        if (response.success && response.data) {
          // Converter resposta da API para UserProfile
          const userProfile: UserProfile = {
            id: response.data.id.toString(),
            name: response.data.name,
            email: response.data.email,
            role: response.data.role as UserRole,
            avatar: response.data.avatar
          };

          // Atualizar perfil local
          localStorage.setItem('user_profile', JSON.stringify(userProfile));
          this.currentUserSubject.next(userProfile);
        }
      })
    );
  }
}
