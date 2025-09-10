import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CategoryFormSkeletonComponent } from '../../../shared/components/category-form-skeleton/category-form-skeleton.component';
import { ToastService } from '../../../shared/services/toast.service';
import { Category, CategoryFormData } from '../../../shared/models';
import { CategoryService, CreateCategoryRequest, UpdateCategoryRequest } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, CategoryFormSkeletonComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
  isLoading = false;
  isLoadingData = false;

  predefinedColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#64748b', '#6b7280', '#374151'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;
    
    if (this.isEditMode && this.categoryId) {
      this.isLoadingData = true;
      this.loadCategory(this.categoryId);
    }
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Categoria' : 'Nova Categoria';
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      color: ['#3b82f6', Validators.required]
    });
  }

  private loadCategory(id: string): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description || '',
          color: category.color
        });
        this.isLoadingData = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categoria:', error);
        this.isLoadingData = false;
        this.toastService.error('Erro ao carregar categoria', 'Não foi possível carregar os dados da categoria. Tente novamente.');
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formData = this.categoryForm.value;

      if (this.isEditMode) {
        this.updateCategory(formData);
      } else {
        this.createCategory(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createCategory(data: CreateCategoryRequest): void {
    this.categoryService.createCategory(data).subscribe({
      next: (category) => {
        console.log('Categoria criada com sucesso:', category);
        this.isLoading = false;
        this.toastService.success('Categoria criada!', `A categoria "${data.name}" foi criada com sucesso.`);
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Erro ao criar categoria:', error);
        this.isLoading = false;
        this.toastService.error('Erro ao criar categoria', 'Não foi possível criar a categoria. Tente novamente.');
      }
    });
  }

  private updateCategory(data: UpdateCategoryRequest): void {
    if (!this.categoryId) return;
    
    this.categoryService.updateCategory(this.categoryId, data).subscribe({
      next: (category) => {
        console.log('Categoria atualizada com sucesso:', category);
        this.isLoading = false;
        this.toastService.success('Categoria atualizada!', `A categoria "${data.name}" foi atualizada com sucesso.`);
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Erro ao atualizar categoria:', error);
        this.isLoading = false;
        this.toastService.error('Erro ao atualizar categoria', 'Não foi possível atualizar a categoria. Tente novamente.');
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/categories', this.categoryId]);
    } else {
      this.router.navigate(['/categories']);
    }
  }

  onDelete(): void {
    if (this.isEditMode && this.categoryId) {
      const categoryName = this.categoryForm.get('name')?.value || 'categoria';
      
      if (confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
        this.isLoading = true;
        
        this.categoryService.deleteCategory(this.categoryId).subscribe({
          next: () => {
            console.log('Categoria excluída com sucesso:', this.categoryId);
            this.isLoading = false;
            this.toastService.success('Categoria excluída!', `A categoria "${categoryName}" foi excluída com sucesso.`);
            this.router.navigate(['/categories']);
          },
          error: (error) => {
            console.error('Erro ao excluir categoria:', error);
            this.isLoading = false;
            this.toastService.error('Erro ao excluir categoria', 'Não foi possível excluir a categoria. Tente novamente.');
          }
        });
      }
    }
  }

  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  // Métodos auxiliares para validação
  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
