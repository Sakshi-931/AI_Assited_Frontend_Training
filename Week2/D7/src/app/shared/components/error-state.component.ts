import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="error-container" role="alert">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div class="error-content">
        <h3 class="error-title">Unable to Load Data</h3>
        <p class="error-message">{{ message() }}</p>
      </div>
      @if (canRetry()) {
        <button type="button" class="retry-btn" (click)="retry.emit()">
          Try Again
        </button>
      }
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.5rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: var(--radius-md);
      color: #991b1b;
    }
    .error-icon {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      color: #dc2626;
    }
    .error-content {
      flex: 1;
    }
    .error-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #991b1b;
      margin-bottom: 0.15rem;
    }
    .error-message {
      font-size: 0.875rem;
      color: #b91c1c;
    }
    .retry-btn {
      padding: 0.5rem 1rem;
      background-color: #dc2626;
      color: white;
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
      transition: background-color var(--transition-fast);
    }
    .retry-btn:hover {
      background-color: #b91c1c;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  readonly message = input<string>('An unexpected error occurred while fetching information.');
  readonly canRetry = input<boolean>(true);
  readonly retry = output<void>();
}
