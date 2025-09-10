import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-skeleton-container">
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-button"></div>
      </div>

      <div class="skeleton-filters">
        <div class="skeleton-filter"></div>
        <div class="skeleton-filter"></div>
      </div>

      <div class="skeleton-grid">
        @for (item of skeletonItems; track $index) {
          <div class="skeleton-user-card">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-content">
              <div class="skeleton-name"></div>
              <div class="skeleton-email"></div>
              <div class="skeleton-role"></div>
            </div>
            <div class="skeleton-actions">
              <div class="skeleton-action-btn"></div>
              <div class="skeleton-action-btn"></div>
              <div class="skeleton-action-btn"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./users-list-skeleton.component.scss']
})
export class UsersListSkeletonComponent {
  @Input() count: number = 6;

  get skeletonItems(): any[] {
    return Array(this.count).fill(0);
  }
}
