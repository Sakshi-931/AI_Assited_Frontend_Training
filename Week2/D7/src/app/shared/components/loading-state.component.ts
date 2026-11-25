import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="state-container">
      <div class="spinner" aria-hidden="true"></div>
      <p class="state-message">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      gap: 1rem;
      background-color: var(--color-bg-card);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--color-border);
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--color-primary-subtle);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .state-message {
      font-size: 0.9375rem;
      color: var(--color-text-secondary);
      font-weight: 500;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  readonly message = input<string>('Loading information...');
}
