import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { UserDetailsSkeletonComponent } from '../../../shared/components/user-details-skeleton/user-details-skeleton.component';
import { User, UserRole } from '../../../shared/models';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../shared/services/toast.service';

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
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadUser(this.userId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'ID do usuário não encontrado na rota';
    }
  }

  private loadUser(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';


    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('UserDetailsComponent: Erro ao carregar usuário:', error);
        this.errorMessage = 'Erro ao carregar usuário. Tente novamente.';
        this.isLoading = false;
        this.toastService.error('Erro ao carregar usuário');

        // Fallback para dados mock em caso de erro
        this.loadMockUser(id);
      }
    });
  }

  private loadMockUser(id: string): void {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: '/assets/avatars/admin.png',
        role: UserRole.ADMIN,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'João Silva',
        email: 'joao@example.com',
        avatar: '/assets/avatars/avatar1.png',
        role: UserRole.USER,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '3',
        name: 'Maria Santos',
        email: 'maria@example.com',
        avatar: '/assets/avatars/avatar2.png',
        role: UserRole.USER,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: '4',
        name: 'Pedro Costa',
        email: 'pedro@example.com',
        avatar: '/assets/avatars/avatar3.png',
        role: UserRole.USER,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16')
      }
    ];

    this.user = mockUsers.find(u => u.id === id) || null;
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

  formatDateShort(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
