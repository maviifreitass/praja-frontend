import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-details-skeleton-container">
      <!-- Breadcrumb skeleton -->
      <div class="skeleton-breadcrumb">
        <div class="skeleton-breadcrumb-item"></div>
        <div class="skeleton-breadcrumb-separator"></div>
        <div class="skeleton-breadcrumb-item"></div>
      </div>

      <!-- Header skeleton -->
      <div class="skeleton-header">
        <div class="skeleton-user-info">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-info">
            <div class="skeleton-name"></div>
            <div class="skeleton-email"></div>
            <div class="skeleton-role"></div>
          </div>
        </div>
        <div class="skeleton-actions">
          <div class="skeleton-btn"></div>
        </div>
      </div>

      <!-- Content skeleton -->
      <div class="skeleton-content">
        <div class="skeleton-section">
          <div class="skeleton-section-title"></div>
          <div class="skeleton-section-content">
            <div class="skeleton-field"></div>
            <div class="skeleton-field"></div>
            <div class="skeleton-field"></div>
          </div>
        </div>

        <div class="skeleton-section">
          <div class="skeleton-section-title"></div>
          <div class="skeleton-section-content">
            <div class="skeleton-field"></div>
            <div class="skeleton-field"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-details-skeleton.component.scss']
})
export class UserDetailsSkeletonComponent {}
