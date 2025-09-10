import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
      return next.handle(req);
    }

    // Obter token JWT
    const token = this.authService.getToken();

    if (token && this.isTokenValid(token)) {
      // Adicionar Authorization header
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Se token inválido (401) ou acesso negado (403), fazer logout
          if (error.status === 401) {
            this.toastService.error('Sessão expirada. Você será redirecionado para o login.');
            this.authService.logout();
          } else if (error.status === 403) {
            this.toastService.error('Acesso negado. Você será redirecionado para o login.');
            this.authService.logout();
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se acesso negado (403) mesmo sem token, fazer logout (caso usuário ainda esteja "logado" localmente)
        if (error.status === 403) {
          this.toastService.error('Acesso negado. Você será redirecionado para o login.');
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Verificar se token JWT é válido (apenas estrutura e expiração)
   */
  private isTokenValid(token: string): boolean {
    try {
      // Verificar estrutura básica do JWT (3 partes)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp < now) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
