import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee, EmergencyContact, FamilyMember } from '../models/employee.model';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  // Fallback initial data in case json-server is starting or offline
  private readonly defaultEmployee: Employee = {
    id: 'EMP001',
    name: 'Sakshi Khankar',
    role: 'Frontend Developer',
    email: 'sakshi.khankar@edusphere.internal',
    phone: '+91 98765 43210',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakshiKhankar&backgroundColor=b6e3f4',
    joiningDate: '2025-01-10',
    bloodGroup: 'O+',
    gender: 'Female',
    dob: '1999-05-14',
    address: 'Flat 402, Tech Park Residency, Hinjawadi Phase 1, Pune, Maharashtra 411057',
  };

  private readonly defaultEmergencyContacts: EmergencyContact[] = [
    {
      id: 'EMG-001',
      employeeId: 'EMP001',
      name: 'Ramesh Khankar',
      relationship: 'Father',
      phone: '+91 98765 00001',
      address: 'Same as permanent residence',
    },
    {
      id: 'EMG-002',
      employeeId: 'EMP001',
      name: 'Aakash Khankar',
      relationship: 'Brother',
      phone: '+91 98765 00003',
      address: 'Kothrud, Pune, Maharashtra',
    },
  ];

  private readonly defaultFamily: FamilyMember[] = [
    {
      id: 'FAM-001',
      employeeId: 'EMP001',
      name: 'Sunita Khankar',
      relationship: 'Mother',
      phone: '+91 98765 00002',
    },
    {
      id: 'FAM-002',
      employeeId: 'EMP001',
      name: 'Ramesh Khankar',
      relationship: 'Father',
      phone: '+91 98765 00001',
    },
  ];

  // Internal writable signals initialized with safe defaults
  private readonly _employee = signal<Employee | null>(this.defaultEmployee);
  private readonly _emergencyContacts = signal<EmergencyContact[]>(this.defaultEmergencyContacts);
  private readonly _familyInfo = signal<FamilyMember[]>(this.defaultFamily);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Readonly signals exposed to consuming components
  readonly employee = this._employee.asReadonly();
  readonly emergencyContacts = this._emergencyContacts.asReadonly();
  readonly familyInfo = this._familyInfo.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Load main profile of the logged-in employee
   */
  loadEmployee(id: string = 'EMP001'): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Employee>(`${this.baseUrl}/employees/${id}`).pipe(
      catchError((err) => {
        this._error.set('Failed to load employee profile. Please ensure json-server is running.');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe((data) => {
      if (data) {
        this._employee.set(data);
      }
    });
  }

  /**
   * Load emergency contacts for the employee
   */
  loadEmergencyContacts(employeeId: string = 'EMP001'): void {
    this.http.get<EmergencyContact[]>(`${this.baseUrl}/emergencyContacts?employeeId=${employeeId}`).pipe(
      catchError(() => of([]))
    ).subscribe((contacts) => {
      this._emergencyContacts.set(contacts);
    });
  }

  /**
   * Load family details for the employee
   */
  loadFamilyInfo(employeeId: string = 'EMP001'): void {
    this.http.get<FamilyMember[]>(`${this.baseUrl}/familyInformation?employeeId=${employeeId}`).pipe(
      catchError(() => of([]))
    ).subscribe((family) => {
      this._familyInfo.set(family);
    });
  }

  /**
   * Convenience batch loader for profile view
   */
  loadFullProfile(employeeId: string = 'EMP001'): void {
    this.loadEmployee(employeeId);
    this.loadEmergencyContacts(employeeId);
    this.loadFamilyInfo(employeeId);
  }
}
