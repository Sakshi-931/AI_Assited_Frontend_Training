import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyPolicy } from '../models/policy.model';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  private readonly defaultPolicies: CompanyPolicy[] = [
    {
      id: 'POL-001',
      title: 'Work From Home Policy',
      category: 'Workplace',
      description: 'Employees are eligible for up to two remote work days per week upon manager approval. Secure VPN access and core communication hours (10:00 AM - 05:00 PM) are mandatory.',
      lastUpdated: '2025-01-05',
    },
    {
      id: 'POL-002',
      title: 'Annual & Sick Leave Policy',
      category: 'Benefits & Leave',
      description: 'Full-time team members accrue 18 days of paid annual leave and 12 days of sick/casual leave per calendar year.',
      lastUpdated: '2025-01-01',
    },
    {
      id: 'POL-003',
      title: 'Attendance & Punctuality Policy',
      category: 'Workplace',
      description: 'Standard working hours require 8 hours and 30 minutes of logged shift time. Logins past 09:30 AM are marked as Late.',
      lastUpdated: '2025-01-08',
    },
    {
      id: 'POL-004',
      title: 'IT Security & Acceptable Use Policy',
      category: 'Compliance & IT',
      description: 'Company equipment must never be used for unauthorized commercial activities. Multi-factor authentication is required across all internal tooling.',
      lastUpdated: '2024-12-15',
    },
  ];

  // Internal writable signals initialized with safe defaults
  private readonly _policies = signal<CompanyPolicy[]>(this.defaultPolicies);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly policies = this._policies.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Fetch all company policies
   */
  loadPolicies(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<CompanyPolicy[]>(`${this.baseUrl}/policies`).pipe(
      catchError(() => {
        this._error.set('Failed to load company policies. Please check backend connection.');
        return of([]);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe((policies) => {
      this._policies.set(policies);
    });
  }
}
