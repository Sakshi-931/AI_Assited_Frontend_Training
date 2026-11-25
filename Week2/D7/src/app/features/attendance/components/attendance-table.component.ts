import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AttendanceRecord } from '../../../core/models/attendance.model';
import { StatusBadgeDirective } from '../../../shared/directives/status-badge.directive';

@Component({
  selector: 'app-attendance-table',
  standalone: true,
  imports: [DatePipe, StatusBadgeDirective],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTableComponent {
  readonly records = input.required<AttendanceRecord[]>();
}
