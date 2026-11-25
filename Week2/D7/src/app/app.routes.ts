import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { PoliciesComponent } from './features/policies/policies.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'policies', component: PoliciesComponent },
  { path: '**', redirectTo: 'dashboard' },
];
