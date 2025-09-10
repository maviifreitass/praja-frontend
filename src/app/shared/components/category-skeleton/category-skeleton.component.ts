import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="categories-grid">
      @for (item of skeletonItems; track item) {
        <div class="category-skeleton">
        <div class="skeleton-header">
          <div class="skeleton-color"></div>
          <div class="skeleton-info">
            <div class="skeleton-title"></div>
            <div class="skeleton-description"></div>
          </div>
          <div class="skeleton-actions">
            <div class="skeleton-action-btn"></div>
            <div class="skeleton-action-btn"></div>
            <div class="skeleton-action-btn"></div>
          </div>
        </div>
        
        <div class="skeleton-stats">
          <div class="skeleton-stat">
            <div class="skeleton-stat-label"></div>
            <div class="skeleton-stat-value"></div>
          </div>
          <div class="skeleton-stat">
            <div class="skeleton-stat-label"></div>
            <div class="skeleton-stat-value"></div>
          </div>
        </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./category-skeleton.component.scss']
})
export class CategorySkeletonComponent {
  @Input() count: number = 6;
  
  get skeletonItems(): number[] {
    return Array(this.count).fill(0).map((_, i) => i);
  }
}
