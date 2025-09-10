import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { TicketDetailsSkeletonComponent } from '../../../shared/components/ticket-details-skeleton/ticket-details-skeleton.component';
import { Ticket, TicketStatus, TicketPriority, UserProfile } from '../../../shared/models';
import { TicketService, UpdateTicketRequest } from '../../../core/services/ticket.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    TicketDetailsSkeletonComponent
  ],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
  ticket: Ticket | null = null;
  ticketId: string | null = null;
  isLoading = true;
  errorMessage = '';
  responseForm: FormGroup;
  isSubmittingResponse = false;
  isGeneratingAI = false;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private authService: AuthService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.responseForm = this.fb.group({
      response: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    if (this.ticketId) {
      this.loadTicket(this.ticketId);
    }
  }

  private loadTicket(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';


    this.ticketService.getTicketByIdAsModel(Number(id)).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('TicketDetailsComponent: Erro ao carregar ticket:', error);
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar ticket. Tente novamente.';

        // Fallback para dados mock
        this.loadMockTicket(id);
      }
    });
  }

  private loadMockTicket(id: string): void {
    // Mock data como fallback
    const mockTickets: Ticket[] = [
      {
        id: '1',
        title: 'Sistema de login não funciona',
        description: 'Usuários relatam problemas ao fazer login no sistema.',
        status: TicketStatus.OPEN,
        priority: TicketPriority.HIGH,
        categoryId: '1',
        assigneeIds: ['1'],
        createdBy: '2',
        createdAt: new Date('2024-01-15T08:30:00'),
        updatedAt: new Date('2024-01-15T14:20:00'),
        response: 'Olá! Identificamos o problema no sistema de login. O issue foi relacionado a um problema de conectividade com o servidor de autenticação. Nossa equipe técnica já implementou uma correção e o sistema deve estar funcionando normalmente agora. Por favor, teste novamente e nos informe se o problema persistir. Obrigado pela paciência!'
      },
      {
        id: '2',
        title: 'Erro na página de produtos',
        description: 'A página de produtos não carrega corretamente quando há muitos itens.',
        status: TicketStatus.OPEN,
        priority: TicketPriority.MEDIUM,
        categoryId: '2',
        assigneeIds: ['2'],
        createdBy: '3',
        createdAt: new Date('2024-01-16T10:15:00'),
        updatedAt: new Date('2024-01-16T10:15:00')
      }
    ];

    this.ticket = mockTickets.find(t => t.id === id) || null;
  }

  onStatusChange(newStatus: TicketStatus): void {
    if (this.ticket && this.ticketId) {

      const updateData: UpdateTicketRequest = {
        title: this.ticket.title,
        description: this.ticket.description,
        category_id: Number(this.ticket.categoryId),
        status: newStatus,
        priority: this.ticket.priority
      };

      this.ticketService.updateTicket(Number(this.ticketId), updateData).subscribe({
        next: (response) => {
          if (this.ticket) {
            this.ticket.status = newStatus;
            this.ticket.updatedAt = new Date();
          }
        },
        error: (error) => {
          console.error('TicketDetailsComponent: Erro ao atualizar status:', error);
          // Reverter mudança local em caso de erro
        }
      });
    }
  }

  onPriorityChange(newPriority: TicketPriority): void {
    if (this.ticket && this.ticketId) {

      // Nota: A API não suporta mudança de prioridade baseada na documentação
      // Então vamos apenas atualizar localmente por enquanto
      this.ticket.priority = newPriority;
      this.ticket.updatedAt = new Date();
    }
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

  getStatusLabel(status: TicketStatus): string {
    const labels = {
      [TicketStatus.OPEN]: 'Aberto',
      [TicketStatus.CLOSED]: 'Fechado'
    };
    return labels[status];
  }

  getPriorityLabel(priority: TicketPriority): string {
    const labels = {
      [TicketPriority.LOW]: 'Baixa',
      [TicketPriority.MEDIUM]: 'Média',
      [TicketPriority.HIGH]: 'Alta'
    };
    return labels[priority];
  }

  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }

  /**
   * Excluir ticket
   */
  deleteTicket(): void {
    if (!this.ticket) {
      console.warn('Nenhum ticket selecionado para exclusão');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este ticket? Esta ação não pode ser desfeita.')) {

      this.ticketService.deleteTicket(Number(this.ticket.id)).subscribe({
        next: () => {
          alert('Ticket excluído com sucesso!');
          // Redirecionar para a lista de tickets
          window.location.href = '/tickets';
        },
        error: (error) => {
          console.error('Erro ao excluir ticket:', error);
          alert('Erro ao excluir ticket. Tente novamente.');
        }
      });
    }
  }

  /**
   * Obter nome do criador do ticket
   * Por enquanto, retorna um nome genérico baseado no ID
   * Em um app real, isso seria uma busca em cache ou API
   */
  getCreatedByName(): string {
    if (!this.ticket) return 'Usuário';

    // Mock: mapear IDs para nomes
    const userMap: { [key: string]: string } = {
      '1': 'João Silva',
      '2': 'Maria Santos',
      '3': 'Pedro Costa',
      '4': 'Ana Lima'
    };

    return userMap[this.ticket.createdBy] || `Usuário ${this.ticket.createdBy}`;
  }

  // Métodos para resposta do admin
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onSubmitResponse(): void {
    if (this.responseForm.valid && this.ticket && this.ticketId) {
      this.isSubmittingResponse = true;
      const response = this.responseForm.get('response')?.value;


      // Criar a requisição de atualização
      const updateRequest: UpdateTicketRequest = {
        response: response
      };

      this.ticketService.updateTicket(Number(this.ticketId), updateRequest).subscribe({
        next: (apiResponse) => {

          // Atualizar o ticket local com a resposta
          if (this.ticket) {
            this.ticket.response = response;
            this.ticket.updatedAt = new Date();
          }

          // Limpar o formulário
          this.responseForm.reset();
          this.isSubmittingResponse = false;

          // Mostrar mensagem de sucesso
          this.toastService.success('Resposta enviada com sucesso!');
        },
        error: (error) => {
          console.error('TicketDetailsComponent: Erro ao salvar resposta:', error);
          this.isSubmittingResponse = false;
          this.toastService.error('Erro ao enviar resposta. Tente novamente.');
        }
      });
    }
  }

  isResponseFormValid(): boolean {
    return this.responseForm.valid;
  }

  getResponseErrorMessage(): string {
    const responseControl = this.responseForm.get('response');
    if (responseControl?.hasError('required')) {
      return 'Resposta é obrigatória';
    }
    if (responseControl?.hasError('minlength')) {
      return 'Resposta deve ter pelo menos 10 caracteres';
    }
    return '';
  }

  generateAIResponse(): void {
    if (!this.ticket || !this.ticketId || this.isGeneratingAI) {
      return;
    }

    this.isGeneratingAI = true;

    this.ticketService.generateAIResponse(this.ticketId).subscribe({
      next: (response) => {
        this.isGeneratingAI = false;
        if (response.success && response.data) {
          this.responseForm.patchValue({
            response: response.data.response
          });
          this.toastService.success('Resposta gerada com IA!');
        }
      },
      error: (error) => {
        this.isGeneratingAI = false;
        console.error('Erro ao gerar resposta com IA:', error);
        this.toastService.error('Erro ao gerar resposta com IA. Tente novamente.');
      }
    });
  }
}
