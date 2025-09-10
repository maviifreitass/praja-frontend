import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-details-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="category-details-skeleton">
      <div class="breadcrumb-skeleton">
        <div class="skeleton-breadcrumb-item"></div>
        <div class="skeleton-breadcrumb-separator"></div>
        <div class="skeleton-breadcrumb-item"></div>
      </div>

      <div class="category-content-skeleton">
        <div class="category-header-skeleton">
          <div class="category-info-skeleton">
            <div class="category-visual-skeleton">
              <div class="skeleton-color-circle"></div>
            </div>
            <div class="category-details-skeleton">
              <div class="skeleton-title"></div>
              <div class="skeleton-meta">
                <div class="skeleton-meta-item"></div>
                <div class="skeleton-meta-item"></div>
              </div>
              <div class="skeleton-description"></div>
            </div>
          </div>
          <div class="actions-skeleton">
            <div class="skeleton-button"></div>
          </div>
        </div>

        <div class="category-body-skeleton">
          <div class="info-card-skeleton">
            <div class="skeleton-card-title"></div>
            <div class="stats-grid-skeleton">
              @for (item of [1,2,3,4]; track item) {
                <div class="stat-item-skeleton">
                  <div class="skeleton-stat-value"></div>
                  <div class="skeleton-stat-label"></div>
                </div>
              }
            </div>
          </div>

          <div class="info-card-skeleton">
            <div class="skeleton-card-title"></div>
            <div class="info-grid-skeleton">
              @for (item of [1,2,3,4]; track item) {
                <div class="info-item-skeleton">
                  <div class="skeleton-info-label"></div>
                  <div class="skeleton-info-value"></div>
                </div>
              }
            </div>
          </div>

          <div class="info-card-skeleton tickets-card-skeleton">
            <div class="card-header-skeleton">
              <div class="skeleton-card-title"></div>
              <div class="skeleton-link"></div>
            </div>
            <div class="tickets-list-skeleton">
              @for (item of [1,2,3]; track item) {
                <div class="ticket-item-skeleton">
                  <div class="ticket-info-skeleton">
                    <div class="skeleton-ticket-title"></div>
                    <div class="ticket-meta-skeleton">
                      @for (meta of [1,2,3]; track meta) {
                        <div class="skeleton-ticket-meta"></div>
                      }
                    </div>
                  </div>
                  <div class="skeleton-ticket-button"></div>
                </div>
              }
            </div>
          </div>

          <div class="info-card-skeleton">
            <div class="skeleton-card-title"></div>
            <div class="timeline-skeleton">
              @for (item of [1,2]; track item) {
                <div class="timeline-item-skeleton">
                  <div class="skeleton-timeline-icon"></div>
                  <div class="timeline-content-skeleton">
                    <div class="skeleton-timeline-title"></div>
                    <div class="skeleton-timeline-date"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./category-details-skeleton.component.scss']
})
export class CategoryDetailsSkeletonComponent {}
