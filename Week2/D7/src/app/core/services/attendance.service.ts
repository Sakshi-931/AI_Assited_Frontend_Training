import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceRecord, TodayPunch } from '../models/attendance.model';
import { environment } from '../../../environments/environment';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

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
   * Helper to return today's ISO date string (YYYY-MM-DD) based on local time
   */
  getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Computed signal to derive today's attendance punch status.
   * Matches against today's date so user starts with Punch In if not marked yet.
   */
  readonly todayPunch = computed<TodayPunch>(() => {
    const records = this._attendanceRecords();
    const todayStr = this.getTodayDateString();

    const todayRecord = records.find((r) => r.date === todayStr);

    if (!todayRecord) {
      return {
        punchIn: '--',
        punchOut: '--',
        status: 'Not Marked',
        workingHours: '--',
        canPunchIn: true,
        canPunchOut: false,
        isCompleted: false,
      };
    }

    const hasPunchedOut = Boolean(todayRecord.punchOut && todayRecord.punchOut !== '--');

    return {
      id: todayRecord.id,
      punchIn: todayRecord.punchIn || '--',
      punchOut: todayRecord.punchOut || '--',
      status: todayRecord.status,
      workingHours: todayRecord.workingHours || '--',
      canPunchIn: false,
      canPunchOut: !hasPunchedOut,
      isCompleted: hasPunchedOut,
    };
  });

  /**
   * Fetch attendance logs for a given employee from REST backend
   */
  loadAttendance(employeeId: string = 'EMP001'): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<AttendanceRecord[]>(`${this.baseUrl}/attendance?employeeId=${employeeId}`)
      .pipe(
        catchError(() => {
          this._error.set('Failed to load attendance logs. Please verify backend connection.');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((records) => {
        if (records && records.length > 0) {
          const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
          this._attendanceRecords.set(sorted);
        }
      });
  }

  /**
   * Toggle punch: Punches in if not punched today, or punches out if already punched in.
   * Directly persists changes to json-server (db.json).
   */
  togglePunch(employeeId: string = 'EMP001'): void {
    const punchState = this.todayPunch();

    if (punchState.canPunchIn) {
      this.executePunchIn(employeeId);
    } else if (punchState.canPunchOut && punchState.id) {
      this.executePunchOut(punchState.id);
    }
  }

  /**
   * Execute Punch In: Creates new record, persists to db.json via POST, updates signal.
   */
  private executePunchIn(employeeId: string): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const todayStr = this.getTodayDateString();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStr = dayNames[now.getDay()];

    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      employeeId,
      date: todayStr,
      day: dayStr,
      punchIn: timeStr,
      punchOut: '--',
      workingHours: 'In Progress',
      status: isLate ? 'Late' : 'Present',
    };

    // Optimistically update signals so Today's Punch & Attendance Table update immediately
    this._attendanceRecords.update((records) => [newRecord, ...records]);

    // Persist to json-server backend (saves to db.json)
    this.http
      .post<AttendanceRecord>(`${this.baseUrl}/attendance`, newRecord)
      .pipe(
        catchError((err) => {
          console.warn('Failed to save punch-in to db.json, using local state:', err);
          return of(newRecord);
        })
      )
      .subscribe();
  }

  /**
   * Execute Punch Out: Updates existing record with punchOut and hours, persists via PATCH.
   */
  private executePunchOut(recordId: string): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const todayStr = this.getTodayDateString();

    const records = this._attendanceRecords();
    const index = records.findIndex((r) => r.id === recordId || r.date === todayStr);

    if (index === -1) return;

    const existing = records[index];

    // Compute duration between punch-in and now
    let hoursStr = '08h 00m';
    try {
      const punchInDate = this.parseTimeStringToDate(existing.punchIn, existing.date);
      if (punchInDate) {
        const diffMs = Math.max(0, now.getTime() - punchInDate.getTime());
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        hoursStr = `${String(diffHrs).padStart(2, '0')}h ${String(diffMins).padStart(2, '0')}m`;
      }
    } catch {
      hoursStr = '08h 00m';
    }

    const updatedRecord: AttendanceRecord = {
      ...existing,
      punchOut: timeStr,
      workingHours: hoursStr,
    };

    // Update local state signal
    this._attendanceRecords.update((list) => {
      const copy = [...list];
      copy[index] = updatedRecord;
      return copy;
    });

    // Persist PATCH to json-server backend (updates db.json)
    const patchPayload = {
      punchOut: timeStr,
      workingHours: hoursStr,
    };

    this.http
      .patch<AttendanceRecord>(`${this.baseUrl}/attendance/${existing.id}`, patchPayload)
      .pipe(
        catchError((err) => {
          console.warn('Failed to patch punch-out to db.json, using local state:', err);
          return of(updatedRecord);
        })
      )
      .subscribe();
  }

  private parseTimeStringToDate(timeStr: string, dateStr?: string): Date | null {
    if (!timeStr || timeStr === '--') return null;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    let d: Date;
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date();
    }
    d.setHours(hours, minutes, 0, 0);
    return d;
  }
}
