import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  color: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService: ApiService) {}

  /**
   * Listar todas as categorias
   * GET /categories/
   */
  getCategories(): Observable<CategoryResponse[]> {
    return this.apiService.get<CategoryResponse[]>('/categories/');
  }

  /**
   * Obter categoria por ID
   * GET /categories/{id}
   */
  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.apiService.get<CategoryResponse>(`/categories/${id}`);
  }

  /**
   * Criar nova categoria
   * POST /categories/
   */
  createCategory(categoryData: CreateCategoryRequest): Observable<CategoryResponse> {
    return this.apiService.post<CategoryResponse>('/categories/', categoryData);
  }

  /**
   * Atualizar categoria
   * PUT /categories/{id}
   */
  updateCategory(id: string, categoryData: UpdateCategoryRequest): Observable<CategoryResponse> {
    return this.apiService.put<CategoryResponse>(`/categories/${id}`, categoryData);
  }

  /**
   * Excluir categoria
   * DELETE /categories/{id}
   */
  deleteCategory(id: string): Observable<null> {
    return this.apiService.delete<null>(`/categories/${id}`);
  }
}
