import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceRecord, TodayPunch } from '../models/attendance.model';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  private readonly defaultRecords: AttendanceRecord[] = [
    {
      id: 'ATT-001',
      employeeId: 'EMP001',
      date: '2025-01-24',
      day: 'Friday',
      punchIn: '09:10 AM',
      punchOut: '06:05 PM',
      workingHours: '08h 55m',
      status: 'Present',
    },
    {
      id: 'ATT-002',
      employeeId: 'EMP001',
      date: '2025-01-23',
      day: 'Thursday',
      punchIn: '09:20 AM',
      punchOut: '06:10 PM',
      workingHours: '08h 50m',
      status: 'Present',
    },
    {
      id: 'ATT-003',
      employeeId: 'EMP001',
      date: '2025-01-22',
      day: 'Wednesday',
      punchIn: '09:35 AM',
      punchOut: '06:00 PM',
      workingHours: '08h 25m',
      status: 'Late',
    },
    {
      id: 'ATT-004',
      employeeId: 'EMP001',
      date: '2025-01-21',
      day: 'Tuesday',
      punchIn: '09:05 AM',
      punchOut: '06:02 PM',
      workingHours: '08h 57m',
      status: 'Present',
    },
    {
      id: 'ATT-005',
      employeeId: 'EMP001',
      date: '2025-01-20',
      day: 'Monday',
      punchIn: '09:12 AM',
      punchOut: '06:15 PM',
      workingHours: '09h 03m',
      status: 'Present',
    },
  ];

  // Internal writable signals initialized with safe defaults
  private readonly _attendanceRecords = signal<AttendanceRecord[]>(this.defaultRecords);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly attendanceRecords = this._attendanceRecords.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Computed signal to derive today's punch record from the latest attendance entry.
   * If records exist, the most recent record represents today's punch status.
   */
  readonly todayPunch = computed<TodayPunch | null>(() => {
    const records = this._attendanceRecords();
    if (!records || records.length === 0) {
      return null;
    }

    const latest = records[0];
    return {
      punchIn: latest.punchIn,
      punchOut: latest.punchOut,
      status: latest.status,
      workingHours: latest.workingHours,
    };
  });

  /**
   * Fetch attendance logs for a given employee
   */
  loadAttendance(employeeId: string = 'EMP001'): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<AttendanceRecord[]>(`${this.baseUrl}/attendance?employeeId=${employeeId}`).pipe(
      catchError(() => {
        this._error.set('Failed to load attendance logs. Please verify backend connection.');
        return of([]);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe((records) => {
      this._attendanceRecords.set(records);
    });
  }
}
