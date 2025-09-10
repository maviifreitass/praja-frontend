import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ticket, Category } from '../../models';
import { StatusChipComponent } from '../status-chip/status-chip.component';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusChipComponent],
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss']
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;
  @Input() categories: Category[] = [];
  @Input() showAddButton = false;
  @Output() deleteTicket = new EventEmitter<Ticket>();

  get ticketCategory(): Category | undefined {
    return this.categories.find(cat => cat.id === this.ticket.categoryId);
  }

  onDeleteTicket(ticket: Ticket): void {
    this.deleteTicket.emit(ticket);
  }
}
