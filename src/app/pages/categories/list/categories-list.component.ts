import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CategorySkeletonComponent } from '../../../shared/components/category-skeleton/category-skeleton.component';
import { ToastService } from '../../../shared/services/toast.service';
import { Category } from '../../../shared/models';
import { CategoryService, CategoryResponse } from '../../../core/services/category.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CategorySkeletonComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(cat => ({
          id: cat.id.toString(),
          name: cat.name,
          description: cat.description,
          color: cat.color,
          createdAt: new Date(cat.created_at),
          updatedAt: cat.updated_at ? new Date(cat.updated_at) : undefined
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar categorias. Tente novamente.';
      }
    });
  }

  onDeleteCategory(category: Category): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.toastService.success('Categoria excluída!', `A categoria "${category.name}" foi excluída com sucesso.`);
        },
        error: (error) => {
          console.error('Erro ao excluir categoria:', error);
          this.toastService.error('Erro ao excluir categoria', 'Não foi possível excluir a categoria. Tente novamente.');
        }
      });
    }
  }

  getTicketCount(categoryId: string): number {
    return 0;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}
