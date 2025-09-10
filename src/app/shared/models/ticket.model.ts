import { UserProfile } from './user.model';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  categoryId: string;
  assigneeIds: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  response?: string;
}

export enum TicketStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  categoryId: string;
  assigneeIds?: string[];
}
