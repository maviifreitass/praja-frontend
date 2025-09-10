import { UserProfile } from './user.model';

export enum ActivityType {
  COMMENT = 'comment',
  STATUS_CHANGE = 'status_change',
  PRIORITY_CHANGE = 'priority_change',
  ASSIGNMENT = 'assignment',
  ATTACHMENT = 'attachment'
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  type: ActivityType;
  content?: string; // Para comentários
  author: UserProfile;
  createdAt: Date;
  metadata?: {
    oldValue?: string;
    newValue?: string;
    fileName?: string;
  };
}

export interface CommentForm {
  content: string;
}
