import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent implements OnInit {
  protected readonly uiState = inject(UiStateService);
  protected readonly employeeService = inject(EmployeeService);

  // Readonly signals from services
  protected readonly currentEmployee = this.employeeService.employee;
  protected readonly isSidebarOpen = this.uiState.isSidebarOpen;

  ngOnInit(): void {
    // Initial load for employee header profile if not yet fetched
    if (!this.currentEmployee()) {
      this.employeeService.loadEmployee('EMP001');
    }
  }

  toggleSidebar(): void {
    this.uiState.toggleSidebar();
  }
}
