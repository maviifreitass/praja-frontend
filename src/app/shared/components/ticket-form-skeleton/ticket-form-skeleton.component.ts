import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-form-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ticket-form-skeleton">
      <!-- Breadcrumb skeleton -->
      <div class="breadcrumb-skeleton">
        <div class="skeleton-breadcrumb-item"></div>
        <div class="skeleton-breadcrumb-separator"></div>
        <div class="skeleton-breadcrumb-item"></div>
      </div>

      <div class="form-container-skeleton">
        <div class="ticket-form-skeleton-content">
          <!-- Título -->
          <div class="form-group-skeleton">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>

          <!-- Descrição -->
          <div class="form-group-skeleton">
            <div class="skeleton-label"></div>
            <div class="skeleton-textarea large"></div>
          </div>

          <!-- Row com categoria e prioridade -->
          <div class="form-row-skeleton">
            <div class="form-group-skeleton">
              <div class="skeleton-label"></div>
              <div class="skeleton-select"></div>
            </div>
            <div class="form-group-skeleton">
              <div class="skeleton-label"></div>
              <div class="skeleton-select"></div>
              <div class="priority-preview-skeleton"></div>
            </div>
          </div>

          <!-- Assignees -->
          <div class="form-group-skeleton">
            <div class="skeleton-label"></div>
            <div class="assignees-skeleton">
              @for (item of [1,2,3]; track item) {
                <div class="skeleton-assignee"></div>
              }
              <div class="skeleton-add-assignee"></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions-skeleton">
            <div class="actions-left-skeleton">
              <div class="skeleton-button secondary"></div>
            </div>
            <div class="actions-right-skeleton">
              <div class="skeleton-button danger"></div>
              <div class="skeleton-button primary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ticket-form-skeleton.component.scss']
})
export class TicketFormSkeletonComponent {}
