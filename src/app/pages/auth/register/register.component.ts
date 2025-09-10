import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { ApiResponse } from '../../../core/services/api.service';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { UserRole } from '../../../shared/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const { name, email, password } = this.registerForm.value;
      
      // Preparar dados para API (role padrão: USER)
      const userData = {
        name: name,
        email: email,
        password: password,
        role: UserRole.USER
      };
      
      this.userService.registerUser(userData).subscribe({
        next: (response: ApiResponse<any>) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
            setTimeout(() => {
              this.router.navigate(['/auth/login'], {
                queryParams: { message: 'registration_success' }
              });
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Erro ao criar conta';
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erro no registro:', error);
          
          // Tratar diferentes tipos de erro
          if (error.status === 400) {
            this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
          } else if (error.status === 422) {
            this.errorMessage = 'Email já está em uso. Escolha outro email.';
          } else if (error.status === 500) {
            this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          } else {
            this.errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Mínimo de ${requiredLength} caracteres`;
      }
      if (field.errors['passwordMismatch']) {
        return 'As senhas não coincidem';
      }
      if (field.errors['requiredTrue']) {
        return 'Você deve aceitar os termos de uso';
      }
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

  getPasswordStrength(): { strength: number; label: string; color: string } {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const levels = [
      { label: 'Muito fraca', color: '#ef4444' },
      { label: 'Fraca', color: '#f97316' },
      { label: 'Regular', color: '#eab308' },
      { label: 'Boa', color: '#22c55e' },
      { label: 'Excelente', color: '#16a34a' }
    ];
    
    return {
      strength: (strength / 5) * 100,
      label: levels[strength - 1]?.label || '',
      color: levels[strength - 1]?.color || '#e5e7eb'
    };
  }
}
