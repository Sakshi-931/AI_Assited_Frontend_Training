import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthUser, LoginCredentials } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly storageKey = 'edusphere_session_user';

  // Demo fallback user credentials for offline / mock testing
  private readonly demoUser: AuthUser = {
    id: 'USR001',
    employeeId: 'EMP001',
    email: 'sakshi.khankar@edusphere.com',
    name: 'Sakshi Khankar',
    role: 'Frontend Developer',
    token: 'mock-jwt-token-sakshi-khankar-2026',
  };

  // State signals
  private readonly _currentUser = signal<AuthUser | null>(this.getInitialUser());
  private readonly _isAuthenticated = signal<boolean>(this.getInitialUser() !== null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Attempt user login via REST backend, with safe local fallback
   */
  login(credentials: LoginCredentials): void {
    this._loading.set(true);
    this._error.set(null);

    const emailTrimmed = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // Call mock REST API
    this.http
      .get<Array<AuthUser & { password?: string }>>(
        `${this.baseUrl}/users?email=${encodeURIComponent(emailTrimmed)}`
      )
      .pipe(
        catchError(() => {
          // If json-server is unreachable or in read-only mode, fall back to offline verification
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((users) => {
        let matchedUser: AuthUser | null = null;

        if (users && users.length > 0) {
          const userRecord = users[0];
          if (userRecord.password === password) {
            matchedUser = {
              id: userRecord.id,
              employeeId: userRecord.employeeId,
              email: userRecord.email,
              name: userRecord.name,
              role: userRecord.role,
              token: userRecord.token || 'mock-jwt-token-2026',
            };
          }
        }

        // Offline / fallback check against demo credentials
        if (!matchedUser && emailTrimmed === this.demoUser.email.toLowerCase() && password === 'Password123!') {
          matchedUser = this.demoUser;
        }

        if (matchedUser) {
          this.setAuthenticatedUser(matchedUser, credentials.rememberMe ?? true);
          this.router.navigate(['/dashboard']);
        } else {
          this._error.set('Invalid email address or password. Please try again.');
        }
      });
  }

  /**
   * Log out the current user and redirect to login page
   */
  logout(): void {
    try {
      sessionStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.storageKey);
    } catch {
      // Ignore storage errors in restricted contexts
    }
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._error.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Persist user session to browser storage (localStorage if rememberMe, otherwise sessionStorage)
   */
  private setAuthenticatedUser(user: AuthUser, rememberMe: boolean = true): void {
    try {
      if (rememberMe) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        sessionStorage.removeItem(this.storageKey);
      } else {
        sessionStorage.setItem(this.storageKey, JSON.stringify(user));
        localStorage.removeItem(this.storageKey);
      }
    } catch {
      // Ignore storage errors
    }
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
    this._error.set(null);
  }

  /**
   * Restore user session on app reload (checking localStorage first, then sessionStorage)
   */
  private getInitialUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored) as AuthUser;
      }
    } catch {
      // Return null on parsing errors
    }
    return null;
  }
}
