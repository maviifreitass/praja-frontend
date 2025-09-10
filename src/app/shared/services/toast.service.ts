import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  
  constructor(private ngZone: NgZone) {}
  
  get toasts() {
    return this.toasts$.asObservable();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private addToast(toast: Omit<Toast, 'id'>): void {
    const newToast: Toast = {
      id: this.generateId(),
      duration: toast.duration || 4000, // Use provided duration or default to 4s
      ...toast
    };

    const currentToasts = this.toasts$.value;
    this.toasts$.next([...currentToasts, newToast]);

    // Auto remove after duration if duration > 0
    if (newToast.duration && newToast.duration > 0) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.removeToast(newToast.id);
          });
        }, newToast.duration);
      });
    }
  }

  success(title: string, message?: string, duration?: number): void {
    this.addToast({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number): void {
    // Errors don't auto-dismiss by default (duration = 0) unless explicitly set
    this.addToast({ type: 'error', title, message, duration: duration || 0 });
  }

  warning(title: string, message?: string, duration?: number): void {
    // Warnings don't auto-dismiss by default (duration = 0) unless explicitly set  
    this.addToast({ type: 'warning', title, message, duration: duration || 0 });
  }

  info(title: string, message?: string, duration?: number): void {
    this.addToast({ type: 'info', title, message, duration });
  }

  removeToast(id: string): void {
    const currentToasts = this.toasts$.value;
    this.toasts$.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts$.next([]);
  }
}
