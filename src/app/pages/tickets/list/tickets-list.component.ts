import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TicketCardComponent } from '../../../shared/components/ticket-card/ticket-card.component';
import { TicketsListSkeletonComponent } from '../../../shared/components/tickets-list-skeleton/tickets-list-skeleton.component';
import { Ticket, TicketStatus, TicketPriority, Category } from '../../../shared/models';
import { TicketService } from '../../../core/services/ticket.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    TicketCardComponent,
    TicketsListSkeletonComponent
  ],
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent implements OnInit {
  TicketStatus = TicketStatus;
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  categories: Category[] = [];
  isLoading = true;
  errorMessage = '';

  filterOptions = {
    status: 'all' as TicketStatus | 'all',
    priority: 'all' as TicketPriority | 'all',
    category: 'all' as string,
    search: ''
  };

  constructor(
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTickets();
  }

  private loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';


    // Teste direto da API primeiro
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {

        // Converter manualmente para o modelo interno
        const convertedTickets: Ticket[] = tickets.map(ticket => ({
          id: ticket.id.toString(),
          title: ticket.title,
          description: ticket.description,
          status: this.convertStringToTicketStatus(ticket.status),
          priority: this.convertStringToTicketPriority(ticket.priority),
          categoryId: ticket.category_id.toString(),
          assigneeIds: [], // Valor padrão por enquanto
          createdBy: ticket.created_by.toString(),
          createdAt: new Date(ticket.created_at),
          updatedAt: new Date(ticket.updated_at)
        }));

        this.tickets = convertedTickets;
        this.filteredTickets = [...this.tickets];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('TicketsListComponent: Erro ao carregar tickets:', error);
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar tickets. Tente novamente.';

        // Fallback para dados mock em caso de erro
      }
    });
  }

  private loadCategories(): void {
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
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  onStatusFilter(status: TicketStatus | 'all'): void {
    this.filterOptions.status = status;
    this.applyFilters();
  }

  onPriorityFilter(priority: TicketPriority | 'all'): void {
    this.filterOptions.priority = priority;
    this.applyFilters();
  }

  onCategoryFilter(categoryId: string): void {
    this.filterOptions.category = categoryId;
    this.applyFilters();
  }

  onSearchChange(search: string): void {
    this.filterOptions.search = search;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesStatus = this.filterOptions.status === 'all' || ticket.status === this.filterOptions.status;
      const matchesPriority = this.filterOptions.priority === 'all' || ticket.priority === this.filterOptions.priority;
      const matchesCategory = this.filterOptions.category === 'all' || ticket.categoryId === this.filterOptions.category;
      const matchesSearch = !this.filterOptions.search ||
        ticket.title.toLowerCase().includes(this.filterOptions.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(this.filterOptions.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
    });
  }

  getStatusCount(status: TicketStatus | 'all'): number {
    if (status === 'all') return this.tickets.length;
    return this.tickets.filter(t => t.status === status).length;
  }

  getCategoryCount(categoryId: string): number {
    if (categoryId === 'all') return this.tickets.length;
    return this.tickets.filter(t => t.categoryId === categoryId).length;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Categoria';
  }

  private convertStringToTicketStatus(status: string): TicketStatus {
    switch (status.toLowerCase()) {
      case 'open':
      case 'aberto':
        return TicketStatus.OPEN;
      case 'closed':
      case 'fechado':
        return TicketStatus.CLOSED;
      default:
        return TicketStatus.OPEN; // Default fallback
    }
  }

  private convertStringToTicketPriority(priority: string): TicketPriority {
    switch (priority.toUpperCase()) {
      case 'LOW':
      case 'BAIXA':
        return TicketPriority.LOW;
      case 'MEDIUM':
      case 'MÉDIA':
      case 'MEDIA':
        return TicketPriority.MEDIUM;
      case 'HIGH':
      case 'ALTA':
        return TicketPriority.HIGH;
      default:
        return TicketPriority.MEDIUM; // Default fallback
    }
  }

  onDeleteTicket(ticket: Ticket): void {
    const confirmMessage = `Tem certeza que deseja excluir o ticket "${ticket.title}"?`;

    if (confirm(confirmMessage)) {
      this.ticketService.deleteTicket(Number(ticket.id)).subscribe({
        next: () => {
          this.tickets = this.tickets.filter(t => t.id !== ticket.id);
          this.applyFilters();
          this.toastService.success(`Ticket "${ticket.title}" excluído com sucesso!`);
        },
        error: (error) => {
          console.error('Erro ao excluir ticket:', error);
          this.toastService.error('Erro ao excluir ticket. Tente novamente.');
        }
      });
    }
  }
}
