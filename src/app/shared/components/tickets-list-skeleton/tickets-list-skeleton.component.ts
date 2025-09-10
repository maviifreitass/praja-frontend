import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-list-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tickets-list-skeleton">
      <!-- Controls skeleton -->
      <div class="controls-skeleton">
        <div class="filters-skeleton">
          @for (filter of [1,2]; track filter) {
            <div class="filter-group-skeleton">
              <div class="skeleton-label"></div>
              <div class="skeleton-select"></div>
            </div>
          }
          <div class="search-group-skeleton">
            <div class="skeleton-search-input"></div>
          </div>
        </div>
        <div class="actions-skeleton">
          <div class="skeleton-button"></div>
        </div>
      </div>

      <!-- Tickets grid skeleton -->
      <div class="tickets-grid-skeleton">
        @for (item of skeletonItems; track item) {
          <div class="ticket-card-skeleton">
          <div class="ticket-header-skeleton">
            <div class="ticket-title-skeleton"></div>
            <div class="ticket-status-skeleton"></div>
          </div>
          <div class="ticket-meta-skeleton">
            <div class="skeleton-meta-item"></div>
            <div class="skeleton-meta-item"></div>
            <div class="skeleton-meta-item"></div>
          </div>
          <div class="ticket-description-skeleton"></div>
          <div class="ticket-footer-skeleton">
            <div class="ticket-assignee-skeleton"></div>
            <div class="ticket-date-skeleton"></div>
          </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./tickets-list-skeleton.component.scss']
})
export class TicketsListSkeletonComponent {
  @Input() count: number = 8;
  
  get skeletonItems(): number[] {
    return Array(this.count).fill(0).map((_, i) => i);
  }
}
