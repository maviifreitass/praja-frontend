import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketStatus, TicketPriority } from '../../models';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.scss']
})
export class StatusChipComponent {
  @Input() status?: TicketStatus;
  @Input() priority?: TicketPriority;
  @Input() type: 'status' | 'priority' = 'status';

  get chipClass(): string {
    if (this.type === 'status' && this.status) {
      return `chip chip-status chip-status-${this.status}`;
    }
    if (this.type === 'priority' && this.priority) {
      return `chip chip-priority chip-priority-${this.priority}`;
    }
    return 'chip';
  }

  get chipText(): string {
    if (this.type === 'status' && this.status) {
      const statusLabels = {
        [TicketStatus.OPEN]: 'Aberto',
        [TicketStatus.CLOSED]: 'Fechado'
      };
      return statusLabels[this.status] || this.status;
    }
    if (this.type === 'priority' && this.priority) {
      const priorityLabels = {
        [TicketPriority.LOW]: 'Baixo',
        [TicketPriority.MEDIUM]: 'Médio',
        [TicketPriority.HIGH]: 'Alto'
      };
      return priorityLabels[this.priority] || this.priority;
    }
    return '';
  }
}
