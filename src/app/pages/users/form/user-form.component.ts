import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { UserFormSkeletonComponent } from '../../../shared/components/user-form-skeleton/user-form-skeleton.component';
import { User, UserRole } from '../../../shared/models';
import { UserService } from '../../../core/services/user.service';
import { ApiResponse } from '../../../core/services/api.service';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    UserFormSkeletonComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  isLoading = false;
  isLoadingData = false;
  errorMessage = '';
  successMessage = '';
  UserRole = UserRole;

  roleOptions = [
    { value: UserRole.USER, label: 'Usuário' },
    { value: UserRole.ADMIN, label: 'Administrador' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.userForm = this.createForm();
  }

    ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;
    
    // Recriar o formulário após definir isEditMode
    this.userForm = this.createForm();
    
    if (this.isEditMode && this.userId) {
      this.isLoadingData = true;
      this.loadUser(this.userId);
    }
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Usuário' : 'Novo Usuário';
  }

  private createForm(): FormGroup {
    // Definir campos base
    const formConfig: any = {
      name: ['', [Validators.required, CustomValidators.fullName()]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    };

    // Adicionar campo de senha apenas para novos usuários
    if (!this.isEditMode) {
      formConfig.password = ['', [Validators.required, CustomValidators.strongPassword()]];
    }

    return this.fb.group(formConfig);
  }

  private loadUser(id: string): void {

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || ''
        });
        this.isLoadingData = false;
      },
      error: (error) => {
        console.error('UserFormComponent: Erro ao carregar usuário:', error);
        this.isLoadingData = false;
        this.toastService.error('Erro ao carregar dados do usuário');
        
        // Fallback para dados mock em caso de erro
        this.loadMockUser(id);
      }
    });
  }

  private loadMockUser(id: string): void {
    const mockUser: User = {
      id: '2',
      name: 'João Silva',
      email: 'joao@example.com',
      avatar: '/assets/avatars/avatar1.png',
      role: UserRole.USER,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    };

    if (mockUser) {
      this.userForm.patchValue({
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: mockUser.avatar || ''
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.userForm.value;

      if (this.isEditMode) {
        this.updateUser(formData);
      } else {
        this.createUser(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createUser(data: any): void {

    this.userService.registerUser(data).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isLoading = false;
        
        if (response.success) {
          this.toastService.success('Usuário criado com sucesso!');
          this.router.navigate(['/users']);
        } else {
          this.toastService.error(response.message || 'Erro ao criar usuário');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('UserFormComponent: Erro ao criar usuário:', error);
        
        // Tratar diferentes tipos de erro
        if (error.status === 400) {
          this.toastService.error('Dados inválidos. Verifique os campos e tente novamente.');
        } else if (error.status === 422) {
          this.toastService.error('Email já está em uso. Escolha outro email.');
        } else if (error.status === 500) {
          this.toastService.error('Erro interno do servidor. Tente novamente mais tarde.');
        } else {
          this.toastService.error(error.message || 'Erro ao criar usuário. Tente novamente.');
        }
      }
    });
  }

  private updateUser(data: any): void {
    if (!this.userId) return;


    this.userService.updateUser(this.userId, data).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.toastService.success('Usuário atualizado com sucesso!');
        this.router.navigate(['/users', this.userId]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('UserFormComponent: Erro ao atualizar usuário:', error);
        this.toastService.error('Erro ao atualizar usuário. Tente novamente.');
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/users', this.userId]);
    } else {
      this.router.navigate(['/users']);
    }
  }

  onDelete(): void {
    if (this.isEditMode && this.userId && confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      this.isLoading = true;


      this.userService.deleteUser(this.userId).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.success('Usuário excluído com sucesso!');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('UserFormComponent: Erro ao excluir usuário:', error);
          this.toastService.error('Erro ao excluir usuário. Tente novamente.');
        }
      });
    }
  }

  // Métodos auxiliares para validação
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      return CustomValidators.getErrorMessage(fieldName, field.errors);
    }
    return '';
  }

  /**
   * Limpar mensagens de erro e sucesso
   */
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
