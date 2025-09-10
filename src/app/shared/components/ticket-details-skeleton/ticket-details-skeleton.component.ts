import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-details-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ticket-details-skeleton">
      <!-- Breadcrumb skeleton -->
      <div class="breadcrumb-skeleton">
        <div class="skeleton-breadcrumb-item"></div>
        <div class="skeleton-breadcrumb-separator"></div>
        <div class="skeleton-breadcrumb-item"></div>
      </div>

      <div class="ticket-content-skeleton">
        <!-- Header skeleton -->
        <div class="ticket-header-skeleton">
          <div class="title-section-skeleton">
            <div class="skeleton-ticket-title"></div>
            <div class="ticket-meta-skeleton">
              <div class="skeleton-ticket-id"></div>
              <div class="skeleton-created-info"></div>
            </div>
          </div>
          <div class="actions-skeleton">
            <div class="skeleton-button"></div>
          </div>
        </div>

        <div class="ticket-body-skeleton">
          <!-- Sidebar skeleton -->
          <div class="ticket-sidebar-skeleton">
            @for (section of [1,2,3,4]; track section) {
              <div class="info-section-skeleton">
                <div class="skeleton-section-title"></div>
                <div class="skeleton-section-content"></div>
              </div>
            }
          </div>

          <!-- Main content skeleton -->
          <div class="ticket-main-skeleton">
            <!-- Description skeleton -->
            <div class="description-section-skeleton">
              <div class="skeleton-section-title"></div>
              <div class="skeleton-description-content"></div>
            </div>

            <!-- Activities skeleton -->
            <div class="activities-section-skeleton">
              <div class="skeleton-section-title"></div>
              
              <!-- Activity items -->
              @for (activity of [1,2,3]; track activity) {
                <div class="activity-item-skeleton">
                  <div class="activity-avatar-skeleton"></div>
                  <div class="activity-content-skeleton">
                    <div class="activity-header-skeleton">
                      <div class="skeleton-activity-author"></div>
                      <div class="skeleton-activity-time"></div>
                    </div>
                    <div class="skeleton-activity-message"></div>
                  </div>
                </div>
              }

              <!-- Comment form skeleton -->
              <div class="comment-form-skeleton">
                <div class="skeleton-form-label"></div>
                <div class="skeleton-textarea"></div>
                <div class="skeleton-form-actions">
                  <div class="skeleton-button secondary"></div>
                  <div class="skeleton-button primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ticket-details-skeleton.component.scss']
})
export class TicketDetailsSkeletonComponent {}
