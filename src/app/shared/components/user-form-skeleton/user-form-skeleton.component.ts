import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-form-skeleton-container">
      <!-- Breadcrumb skeleton -->
      <div class="skeleton-breadcrumb">
        <div class="skeleton-breadcrumb-item"></div>
        <div class="skeleton-breadcrumb-separator"></div>
        <div class="skeleton-breadcrumb-item"></div>
      </div>

      <!-- Header skeleton -->
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
      </div>

      <!-- Form skeleton -->
      <div class="skeleton-form">
        <div class="skeleton-form-row">
          <div class="skeleton-form-field">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>
          <div class="skeleton-form-field">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>
        </div>

        <div class="skeleton-form-row">
          <div class="skeleton-form-field">
            <div class="skeleton-label"></div>
            <div class="skeleton-select"></div>
          </div>
          <div class="skeleton-form-field">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>
        </div>

        <div class="skeleton-form-row">
          <div class="skeleton-form-field full-width">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>
        </div>

        <!-- Actions skeleton -->
        <div class="skeleton-actions">
          <div class="skeleton-btn secondary"></div>
          <div class="skeleton-btn primary"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-form-skeleton.component.scss']
})
export class UserFormSkeletonComponent {}
