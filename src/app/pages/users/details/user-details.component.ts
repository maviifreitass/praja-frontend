import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { UserDetailsSkeletonComponent } from '../../../shared/components/user-details-skeleton/user-details-skeleton.component';
import { User, UserRole } from '../../../shared/models';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    UserDetailsSkeletonComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;
  UserRole = UserRole;
  isLoading = true;
  errorMessage = '';
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // Verificar se usuário USER está tentando acessar perfil de outro usuário
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.role === UserRole.USER && currentUser.id !== this.userId) {
        // Usuário USER tentando acessar perfil de outro usuário - redirecionar para seu próprio perfil
        this.isLoading = false;
        this.errorMessage = 'Você só pode visualizar seu próprio perfil.';
        return;
      }

      this.loadUser(this.userId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'ID do usuário não encontrado na rota';
    }
  }

  private loadUser(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Verificar se é usuário comum tentando acessar seu próprio perfil
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === UserRole.USER && currentUser.id === id) {
      // Para usuários USER acessando seu próprio perfil, usar auth/me
      this.authService.getUserProfile().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Converter UserProfile para User
            this.user = {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email || '',
              avatar: response.data.avatar,
              role: response.data.role || UserRole.USER,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            this.isLoading = false;
          } else {
            this.handleLoadError('Erro ao carregar perfil do usuário');
          }
        },
        error: (error) => {
          console.error('UserDetailsComponent: Erro ao carregar perfil via auth/me:', error);
          this.handleLoadError('Erro ao carregar perfil do usuário');
        }
      });
    } else {
      // Para administradores ou acesso a outros usuários, usar endpoint normal
      this.userService.getUserById(id).subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('UserDetailsComponent: Erro ao carregar usuário:', error);
          this.handleLoadError('Erro ao carregar usuário');
        }
      });
    }
  }

  private handleLoadError(message: string): void {
    this.isLoading = false;
    this.toastService.error(message);

    // Tentar fallback para dados mock em caso de erro
    if (this.userId) {
      if (!this.user) {
        this.errorMessage = message + '. Tente novamente.';
      }
    } else {
      this.errorMessage = message + '. Tente novamente.';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getRoleLabel(role: UserRole): string {
    const labels = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.USER]: 'Usuário'
    };
    return labels[role];
  }

  getRoleClass(role: UserRole): string {
    return `role-${role}`;
  }

  getRoleDescription(role: UserRole): string {
    const descriptions = {
      [UserRole.ADMIN]: 'Acesso total ao sistema, pode gerenciar usuários e configurações',
      [UserRole.USER]: 'Pode criar e gerenciar seus próprios tickets'
    };
    return descriptions[role];
  }
}
