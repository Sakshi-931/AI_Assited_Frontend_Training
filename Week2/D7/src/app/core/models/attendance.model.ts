export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;       // ISO date string: YYYY-MM-DD
  day: string;        // e.g., 'Monday', 'Tuesday'
  punchIn: string;    // e.g., '09:10 AM' or '-'
  punchOut: string;   // e.g., '06:05 PM' or '-'
  workingHours: string; // e.g., '8h 55m' or '0h 0m'
  status: AttendanceStatus;
}

export interface TodayPunch {
  punchIn: string;
  punchOut: string;
  status: AttendanceStatus;
  workingHours: string;
}

