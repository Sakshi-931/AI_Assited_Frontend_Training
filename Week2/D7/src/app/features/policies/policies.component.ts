import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { PolicyService } from '../../core/services/policy.service';
import { PolicyCardComponent } from './components/policy-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [
    PolicyCardComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesComponent implements OnInit {
  protected readonly policyService = inject(PolicyService);

  readonly policies = this.policyService.policies;
  readonly isLoading = this.policyService.loading;
  readonly errorMessage = this.policyService.error;

  // Selected filter category signal
  readonly selectedCategory = signal<string>('All');

  // Available unique categories derived dynamically
  readonly categories = computed<string[]>(() => {
    const list = this.policies();
    const unique = Array.from(new Set(list.map((p) => p.category)));
    return ['All', ...unique];
  });

  // Filtered policies based on selected category
  readonly filteredPolicies = computed(() => {
    const active = this.selectedCategory();
    const all = this.policies();
    if (active === 'All') {
      return all;
    }
    return all.filter((p) => p.category === active);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.policyService.loadPolicies();
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
