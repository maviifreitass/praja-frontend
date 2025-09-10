import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { Ticket, TicketStatus, TicketPriority } from '../../shared/models';

export interface CreateTicketRequest {
  title: string;
  description: string;
  category_id: number;
  priority: string;
}

export interface CreateTicketResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_by: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  category_id?: number;
  status?: string;
  priority?: string;
  response?: string;
}

export interface AIResponseData {
  response: string;
  used_model: string;
  generated_at: string;
}

export interface TicketResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_by: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  response?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private apiService: ApiService) {}

  getTickets(): Observable<TicketResponse[]> {
    const result = this.apiService.get<TicketResponse[]>('/tickets/');
    return result;
  }

  createTicket(ticketData: CreateTicketRequest): Observable<CreateTicketResponse> {
    const result = this.apiService.post<CreateTicketResponse>('/tickets/', ticketData);
    return result;
  }

  getTicketById(id: number): Observable<TicketResponse> {
    return this.apiService.get<TicketResponse>(`/tickets/${id}`);
  }

  updateTicket(id: number, ticketData: UpdateTicketRequest): Observable<TicketResponse> {
    return this.apiService.put<TicketResponse>(`/tickets/${id}`, ticketData);
  }

  deleteTicket(id: number): Observable<void> {
    return this.apiService.delete<void>(`/tickets/${id}`);
  }

  generateAIResponse(ticketId: string): Observable<ApiResponse<AIResponseData>> {
    return this.apiService.post<any>(`/tickets/${ticketId}/ai-response`, {}).pipe(
      map((response: any) => {
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
          return response as ApiResponse<AIResponseData>;
        }

        return {
          success: true,
          data: response as AIResponseData,
          message: 'Resposta gerada com sucesso'
        } as ApiResponse<AIResponseData>;
      })
    );
  }

  private mapToTicket(response: TicketResponse): Ticket {
    return {
      id: response.id.toString(),
      title: response.title,
      description: response.description,
      status: this.mapToTicketStatus(response.status),
      priority: this.mapToTicketPriority(response.priority),
      categoryId: response.category_id.toString(),
      assigneeIds: [],
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
      createdBy: response.created_by.toString(),
      response: response.response
    };
  }

  private mapToTicketStatus(status: string): TicketStatus {
    switch (status.toLowerCase()) {
      case 'open': return TicketStatus.OPEN;
      case 'closed': return TicketStatus.CLOSED;
      default: return TicketStatus.OPEN;
    }
  }

  private mapToTicketPriority(priority: string): TicketPriority {
    switch (priority.toUpperCase()) {
      case 'LOW': return TicketPriority.LOW;
      case 'MEDIUM': return TicketPriority.MEDIUM;
      case 'HIGH': return TicketPriority.HIGH;
      default: return TicketPriority.MEDIUM;
    }
  }

  getTicketByIdAsModel(id: number): Observable<Ticket> {
    return new Observable(observer => {
      this.getTicketById(id).subscribe({
        next: (ticket) => {
          const convertedTicket = this.mapToTicket(ticket);
          observer.next(convertedTicket);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
