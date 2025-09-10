import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static instance: ApiService;
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl || 'http://localhost:8000/';

    if (ApiService.instance) {
      return ApiService.instance;
    }
    ApiService.instance = this;
  }

  /**
   * Getter para acessar a instância singleton
   */
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      throw new Error('ApiService não foi inicializado. Injete o serviço primeiro.');
    }
    return ApiService.instance;
  }

  /**
   * Getter para a URL base
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Constrói a URL completa concatenando a base com o path
   */
  private buildUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    return `${cleanBaseUrl}${cleanPath}`;
  }

  /**
   * Tratamento centralizado de erros
   */
  private handleError(error: any): Observable<never> {
    console.error('Erro na API:', error);

    let errorMessage = 'Erro desconhecido';

    if (error) {
      switch (true) {
        case error.error instanceof ErrorEvent:
          errorMessage = `Erro: ${error.error.message}`;
          break;

        default:
          errorMessage = error.error?.message || `Erro ${error.status}: ${error.statusText}`;
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Headers padrão para as requisições
   */
  private getDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  /**
   * Método GET
   */
  get<T>(path: string, options?: RequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const headers = options?.headers || this.getDefaultHeaders();

    return this.http.get<T>(url, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Método POST
   */
  post<T>(path: string, body: any, options?: RequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const headers = options?.headers || this.getDefaultHeaders();

    return this.http.post<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      catchError((error) => {
        console.error('ApiService.post: Erro na requisição:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Método PUT
   */
  put<T>(path: string, body: any, options?: RequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const headers = options?.headers || this.getDefaultHeaders();

    return this.http.put<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Método PATCH
   */
  patch<T>(path: string, body: any, options?: RequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const headers = options?.headers || this.getDefaultHeaders();

    return this.http.patch<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Método DELETE
   */
  delete<T>(path: string, options?: RequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const headers = options?.headers || this.getDefaultHeaders();

    return this.http.delete<T>(url, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      catchError(this.handleError)
    );
  }

}
