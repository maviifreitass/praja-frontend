import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ApiResponse } from '../../../core/services/api.service';
import { CustomValidators } from '../../../shared/validators/custom.validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    // Obter URL de retorno dos query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tickets';
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      console.log('LoginComponent: Iniciando login com:', { email, password: '***' });
      
      this.authService.login({ email, password }).subscribe({
        next: (response: ApiResponse<any>) => {
          console.log('LoginComponent: Resposta recebida:', response);
          this.isLoading = false;
          if (response.success) {
            console.log('LoginComponent: Login bem-sucedido, redirecionando para:', this.returnUrl);
            // Login bem-sucedido, redirecionar
            this.router.navigate([this.returnUrl]);
          } else {
            console.log('LoginComponent: Login falhou:', response.message);
            this.errorMessage = 'Email ou senha incorretos.';
          }
        },
        error: (error: any) => {
          console.log('LoginComponent: Erro recebido:', error);
          this.isLoading = false;
          console.error('Erro no login:', error);
          
          // Tratar diferentes tipos de erro
          if (error.status === 401) {
            this.errorMessage = 'Email ou senha incorretos.';
          } else if (error.status === 422) {
            this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
          } else if (error.status === 500) {
            this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          } else {
            this.errorMessage = 'Email ou senha incorretos.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      return CustomValidators.getErrorMessage(fieldName, field.errors);
    }
    return '';
  }

  /**
   * Limpar mensagem de erro
   */
  clearErrorMessage(): void {
    this.errorMessage = '';
  }
}
