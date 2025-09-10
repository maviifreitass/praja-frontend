import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { UsersListSkeletonComponent } from '../../../shared/components/users-list-skeleton/users-list-skeleton.component';
import { User, UserRole } from '../../../shared/models';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../shared/services/toast.service';

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
  isLoading = true;
  errorMessage = '';

  filterOptions = {
    role: 'all' as UserRole | 'all',
    search: ''
  };

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';


    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('UsersListComponent: Erro ao carregar usuários:', error);
        this.errorMessage = 'Erro ao carregar usuários. Tente novamente.';
        this.isLoading = false;
        this.toastService.error('Erro ao carregar usuários');

        // Fallback para dados mock em caso de erro
        this.loadMockUsers();
      }
    });
  }

  private loadMockUsers(): void {
    this.users = [
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

    this.filteredUsers = [...this.users];
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
          
          this.toastService.success('Usuário excluído com sucesso!');
        },
        error: (error) => {
          console.error('UsersListComponent: Erro ao excluir usuário:', error);
          this.toastService.error('Erro ao excluir usuário. Tente novamente.');
        }
      });
    }
  }
}
