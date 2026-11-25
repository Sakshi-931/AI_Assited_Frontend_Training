import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { AttendanceService } from '../../core/services/attendance.service';
import { AttendanceTableComponent } from './components/attendance-table.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    AttendanceTableComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceComponent implements OnInit {
  protected readonly attendanceService = inject(AttendanceService);

  readonly records = this.attendanceService.attendanceRecords;
  readonly isLoading = this.attendanceService.loading;
  readonly errorMessage = this.attendanceService.error;

  // Derived computed metrics for quick statistical summary
  readonly totalDays = computed(() => this.records().length);
  readonly presentDays = computed(
    () => this.records().filter((r) => r.status === 'Present').length
  );
  readonly lateDays = computed(
    () => this.records().filter((r) => r.status === 'Late').length
  );
  readonly leaveDays = computed(
    () => this.records().filter((r) => r.status === 'Leave').length
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.attendanceService.loadAttendance('EMP001');
  }
}
