import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent implements OnInit {
  protected readonly employeeService = inject(EmployeeService);
  protected readonly authService = inject(AuthService);

  // Readonly signal from employee service
  protected readonly currentEmployee = this.employeeService.employee;

  ngOnInit(): void {
    if (!this.currentEmployee()) {
      const empId = this.authService.currentUser()?.employeeId || 'EMP001';
      this.employeeService.loadEmployee(empId);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
