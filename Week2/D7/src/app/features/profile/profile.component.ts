import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { PersonalDetailsComponent } from './components/personal-details.component';
import { EmergencyContactComponent } from './components/emergency-contact.component';
import { FamilyInfoComponent } from './components/family-info.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PersonalDetailsComponent,
    EmergencyContactComponent,
    FamilyInfoComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  protected readonly employeeService = inject(EmployeeService);
  protected readonly authService = inject(AuthService);

  readonly employee = this.employeeService.employee;
  readonly emergencyContacts = this.employeeService.emergencyContacts;
  readonly familyInfo = this.employeeService.familyInfo;
  readonly isLoading = this.employeeService.loading;
  readonly errorMessage = this.employeeService.error;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const empId = this.authService.currentUser()?.employeeId || 'EMP001';
    this.employeeService.loadFullProfile(empId);
  }
}
