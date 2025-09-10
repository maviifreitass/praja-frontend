import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="category-form-skeleton">
      <div class="breadcrumb-skeleton">
        <div class="skeleton-breadcrumb-item"></div>
        <div class="skeleton-breadcrumb-separator"></div>
        <div class="skeleton-breadcrumb-item"></div>
      </div>

      <div class="form-container-skeleton">
        <div class="category-form-skeleton-content">
          <!-- Nome -->
          <div class="form-group-skeleton">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>

          <!-- Descrição -->
          <div class="form-group-skeleton">
            <div class="skeleton-label"></div>
            <div class="skeleton-textarea"></div>
          </div>

          <!-- Cor -->
          <div class="form-group-skeleton">
            <div class="skeleton-label"></div>
            <div class="color-selection-skeleton">
              <div class="selected-color-skeleton">
                <div class="skeleton-color-preview"></div>
                <div class="skeleton-color-value"></div>
              </div>
              
              <div class="color-grid-skeleton">
                @for (item of colorOptions; track item) {
                  <div class="skeleton-color-option"></div>
                }
              </div>
              
              <div class="custom-color-skeleton">
                <div class="skeleton-custom-label"></div>
                <div class="skeleton-color-input"></div>
              </div>
            </div>
          </div>

          <!-- Preview -->
          <div class="category-preview-skeleton">
            <div class="skeleton-label"></div>
            <div class="preview-card-skeleton">
              <div class="preview-header-skeleton">
                <div class="skeleton-preview-color"></div>
                <div class="preview-info-skeleton">
                  <div class="skeleton-preview-name"></div>
                  <div class="skeleton-preview-description"></div>
                </div>
              </div>
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
  styleUrls: ['./category-form-skeleton.component.scss']
})
export class CategoryFormSkeletonComponent {
  colorOptions = Array(20).fill(0).map((_, i) => i);
}
