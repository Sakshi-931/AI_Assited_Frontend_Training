import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card.component';
import { EmployeeRowComponent } from '../../../shared/components/employee-row/employee-row.component';

export type ViewMode = 'card' | 'row';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [EmployeeRowComponent, EmployeeCardComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  readonly employees = signal<Employee[]>([]);
  readonly viewMode = signal<ViewMode>('card');
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  readonly employeeCards = viewChildren(EmployeeCardComponent);
  readonly employeeRows = viewChildren(EmployeeRowComponent);
  readonly tableContainer = viewChild<ElementRef<HTMLDivElement>>('tableContainer');

  readonly renderedCount = computed(() =>
    this.viewMode() === 'card'
      ? this.employeeCards().length
      : this.employeeRows().length
  );

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load employees from json-server:', error);
        this.errorMessage.set(
          'Unable to connect to database at http://localhost:3000. Please ensure json-server is running (npm run server).'
        );
        this.loading.set(false);
      },
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  navigateToDetails(employeeId: number): void {
    this.router.navigate(['/employees', employeeId]);
  }
}