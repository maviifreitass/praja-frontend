import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { UsersListSkeletonComponent } from '../../../shared/components/users-list-skeleton/users-list-skeleton.component';
import { User, UserRole } from '../../../shared/models';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, UsersListSkeletonComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  UserRole = UserRole;
  isLoading = false;
  showSkeleton = false;
  errorMessage = '';
  isAdmin = false;

  filterOptions = {
    role: 'all' as UserRole | 'all',
    search: ''
  };

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar se o usuário atual é admin
    this.isAdmin = this.authService.isAdmin();
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.showSkeleton = false;
    this.errorMessage = '';

    // Mostrar skeleton apenas após um pequeno delay para evitar flash
    const skeletonTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.showSkeleton = true;
      }
    }, 200);

    // Verificar se é usuário comum (role USER) para mostrar apenas o próprio perfil
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === UserRole.USER) {
      // Para usuários comuns, carregar apenas o próprio perfil via /auth/me
      this.authService.getUserProfile().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Converter UserProfile para User
            const user: User = {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email || '',
              avatar: response.data.avatar,
              role: response.data.role || UserRole.USER,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            this.users = [user];
            this.filteredUsers = [...this.users];
            this.isLoading = false;
            this.showSkeleton = false;
            clearTimeout(skeletonTimeout);
          } else {
            this.handleLoadError('Erro ao carregar perfil do usuário');
          }
        },
        error: (error) => {
          console.error('UsersListComponent: Erro ao carregar perfil do usuário:', error);
          this.handleLoadError('Erro ao carregar perfil do usuário');
        }
      });
    } else {
      // Para administradores, carregar todos os usuários
      this.userService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          this.filteredUsers = [...this.users];
          this.isLoading = false;
          this.showSkeleton = false;
          clearTimeout(skeletonTimeout);
        },
        error: (error) => {
          console.error('UsersListComponent: Erro ao carregar usuários:', error);
          this.handleLoadError('Erro ao carregar usuários');
        }
      });
    }
  }

  private handleLoadError(message: string): void {
    this.errorMessage = message + '. Tente novamente.';
    this.isLoading = false;
    this.showSkeleton = false;
  }

  onRoleFilter(role: UserRole | 'all'): void {
    this.filterOptions.role = role;
    this.applyFilters();
  }

  onSearchChange(search: string): void {
    this.filterOptions.search = search;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesRole = this.filterOptions.role === 'all' || user.role === this.filterOptions.role;
      const matchesSearch = !this.filterOptions.search ||
        user.name.toLowerCase().includes(this.filterOptions.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.filterOptions.search.toLowerCase());

      return matchesRole && matchesSearch;
    });
  }

  getRoleCount(role: UserRole | 'all'): number {
    if (role === 'all') return this.users.length;
    return this.users.filter(u => u.role === role).length;
  }

  formatDate(date: Date): string {
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

  onDeleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`)) {

      this.userService.deleteUser(user.id).subscribe({
        next: () => {

          // Remover usuário da lista local
          this.users = this.users.filter(u => u.id !== user.id);
          this.applyFilters();

          // Removido toast de sucesso - ação já é visível na interface
        },
        error: (error) => {
          console.error('UsersListComponent: Erro ao excluir usuário:', error);
          this.toastService.error('Erro ao excluir usuário. Tente novamente.');
        }
      });
    }
  }
}
