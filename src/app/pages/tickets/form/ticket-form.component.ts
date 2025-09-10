import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { TicketFormSkeletonComponent } from '../../../shared/components/ticket-form-skeleton/ticket-form-skeleton.component';
import { Ticket, TicketPriority, CreateTicketDto, Category, UserProfile } from '../../../shared/models';
import { TicketService, CreateTicketRequest, UpdateTicketRequest } from '../../../core/services/ticket.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    StatusChipComponent,
    TicketFormSkeletonComponent
  ],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  ticketForm: FormGroup;
  isEditMode = false;
  ticketId: string | null = null;
  isLoading = false;
  isLoadingData = false;
  errorMessage = '';
  successMessage = '';

  categories: Category[] = [];
  availableUsers: UserProfile[] = [];

  priorityOptions = [
    { value: TicketPriority.LOW, label: 'Baixa' },
    { value: TicketPriority.MEDIUM, label: 'Média' },
    { value: TicketPriority.HIGH, label: 'Alta' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private categoryService: CategoryService
  ) {
    this.ticketForm = this.createForm();
  }

    ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.ticketId;
    
    this.loadCategories();
    this.loadAvailableUsers();
    
    if (this.isEditMode && this.ticketId) {
      this.isLoadingData = true;
      this.loadTicket(this.ticketId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MEDIUM', Validators.required],
      categoryId: ['', Validators.required],
      assigneeIds: [[]]
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        // Converter CategoryResponse para Category
        this.categories = categories.map(cat => ({
          id: cat.id.toString(),
          name: cat.name,
          description: cat.description,
          color: cat.color,
          createdAt: new Date(cat.created_at)
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  private loadAvailableUsers(): void {
    // Mock data - em um app real, isso viria de um serviço
    this.availableUsers = [
      { id: '1', name: 'João Silva', avatar: '/assets/avatars/avatar1.png' },
      { id: '2', name: 'Maria Santos', avatar: '/assets/avatars/avatar2.png' },
      { id: '3', name: 'Pedro Costa', avatar: '/assets/avatars/avatar3.png' },
      { id: '4', name: 'Ana Lima', avatar: '/assets/avatars/avatar4.png' }
    ];
  }

  private loadTicket(id: string): void {
    this.errorMessage = '';
    
    console.log('TicketFormComponent: Carregando ticket com ID:', id);
    
    this.ticketService.getTicketByIdAsModel(Number(id)).subscribe({
      next: (ticket) => {
        this.ticketForm.patchValue({
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          categoryId: ticket.categoryId,
          assigneeIds: ticket.assigneeIds || []
        });
        this.isLoadingData = false;
      },
      error: (error) => {
        console.error('TicketFormComponent: Erro ao carregar ticket:', error);
        this.isLoadingData = false;
        this.errorMessage = 'Erro ao carregar ticket. Tente novamente.';
      }
    });
  }

  onSubmit(): void {
    
    // Verificar erros em cada campo
    Object.keys(this.ticketForm.controls).forEach(key => {
      const control = this.ticketForm.get(key);
      if (control && control.errors) {
      }
    });
    
    if (this.ticketForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formData = this.ticketForm.value;

      if (this.isEditMode) {
        this.updateTicket(formData);
      } else {
        console.log('TicketFormComponent: Modo criação - chamando createTicket');
        this.createTicket(formData);
      }
    } else {
      console.log('TicketFormComponent: Form inválido ou loading, marcando campos como touched');
      this.markFormGroupTouched();
    }
  }

  private createTicket(data: any): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    const ticketData: CreateTicketRequest = {
      title: data.title,
      description: data.description,
      category_id: Number(data.categoryId),
      priority: data.priority
    };
    
    
    this.ticketService.createTicket(ticketData).subscribe({
      next: (response) => {
        console.log('TicketFormComponent: Ticket criado com sucesso:', response);
        this.isLoading = false;
        this.successMessage = 'Ticket criado com sucesso!';
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
          this.router.navigate(['/tickets']);
        }, 1000);
      },
      error: (error) => {
        console.error('TicketFormComponent: Erro ao criar ticket:', error);
        this.isLoading = false;
        
        if (error.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (error.status === 422) {
          this.errorMessage = 'Erro de validação. Verifique os dados fornecidos.';
        } else if (error.status === 500) {
          this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          this.errorMessage = 'Erro ao criar ticket. Tente novamente.';
        }
      }
    });
  }

  private updateTicket(data: any): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    const ticketData: UpdateTicketRequest = {
      title: data.title,
      description: data.description,
      category_id: Number(data.categoryId),
      status: data.status,
      priority: data.priority
    };
    
    console.log('TicketFormComponent: Atualizando ticket', this.ticketId, 'com dados:', ticketData);
    
    this.ticketService.updateTicket(Number(this.ticketId), ticketData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Ticket atualizado com sucesso!';
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
          this.router.navigate(['/tickets', this.ticketId]);
        }, 1000);
      },
      error: (error) => {
        console.error('TicketFormComponent: Erro ao atualizar ticket:', error);
        this.isLoading = false;
        
        if (error.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (error.status === 422) {
          this.errorMessage = 'Erro de validação. Verifique os dados fornecidos.';
        } else if (error.status === 500) {
          this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          this.errorMessage = 'Erro ao atualizar ticket. Tente novamente.';
        }
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.ticketId) {
      this.router.navigate(['/tickets', this.ticketId]);
    } else {
      this.router.navigate(['/tickets']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ticketForm.controls).forEach(key => {
      const control = this.ticketForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ticketForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.ticketForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Mínimo de ${requiredLength} caracteres`;
      }
    }
    return '';
  }

  onAssigneeToggle(userId: string): void {
    const assigneeIds = this.ticketForm.get('assigneeIds')?.value || [];
    const index = assigneeIds.indexOf(userId);

    if (index > -1) {
      assigneeIds.splice(index, 1);
    } else {
      assigneeIds.push(userId);
    }

    this.ticketForm.patchValue({ assigneeIds });
  }

  isAssigneeSelected(userId: string): boolean {
    const assigneeIds = this.ticketForm.get('assigneeIds')?.value || [];
    return assigneeIds.includes(userId);
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Ticket' : 'Novo Ticket';
  }
}
