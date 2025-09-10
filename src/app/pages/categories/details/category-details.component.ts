import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CategoryDetailsSkeletonComponent } from '../../../shared/components/category-details-skeleton/category-details-skeleton.component';
import { Category } from '../../../shared/models';
import { CategoryService } from '../../../core/services/category.service';

interface MockTicket {
  id: string;
  title: string;
  status: 'open' | 'closed';
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CategoryDetailsSkeletonComponent],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit {
  category: Category | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.loadCategory(categoryId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'ID da categoria não fornecido';
    }
  }

  private loadCategory(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.categoryService.getCategoryById(id).subscribe({
      next: (categoryResponse) => {
        this.category = {
          id: categoryResponse.id.toString(),
          name: categoryResponse.name,
          description: categoryResponse.description,
          color: categoryResponse.color,
          createdAt: new Date(categoryResponse.created_at),
          updatedAt: categoryResponse.updated_at ? new Date(categoryResponse.updated_at) : undefined
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categoria:', error);
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar categoria. Tente novamente.';
      }
    });
  }



  getTicketCount(): number {
    return 0;
  }

  getRecentTickets(): MockTicket[] {
    return [];
  }

  getOpenTicketsCount(): number {
    return this.getRecentTickets().filter(t => t.status === 'open').length;
  }

  getClosedTicketsCount(): number {
    return this.getRecentTickets().filter(t => t.status === 'closed').length;
  }

  getHighPriorityTicketsCount(): number {
    return this.getRecentTickets().filter(t => t.priority === 'high').length;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatDateShort(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}
