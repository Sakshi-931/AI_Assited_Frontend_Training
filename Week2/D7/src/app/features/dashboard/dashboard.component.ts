import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeCardComponent } from './components/employee-card.component';
import { PunchCardComponent } from './components/punch-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    EmployeeCardComponent,
    PunchCardComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly attendanceService = inject(AttendanceService);
  private readonly authService = inject(AuthService);

  // Readonly signals exposed to template
  readonly employee = this.employeeService.employee;
  readonly todayPunch = this.attendanceService.todayPunch;

  // Combined loading and error signals
  readonly isLoading = computed(
    () => this.employeeService.loading() || this.attendanceService.loading()
  );

  readonly errorMessage = computed(
    () => this.employeeService.error() || this.attendanceService.error()
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const empId = this.authService.currentUser()?.employeeId || 'EMP001';
    this.employeeService.loadEmployee(empId);
    this.attendanceService.loadAttendance(empId);
  }

  handleTogglePunch(): void {
    const empId = this.authService.currentUser()?.employeeId || 'EMP001';
    this.attendanceService.togglePunch(empId);
  }
}
