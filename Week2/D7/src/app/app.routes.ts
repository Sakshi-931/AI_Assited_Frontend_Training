import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { PoliciesComponent } from './features/policies/policies.component';
import { LoginComponent } from './features/auth/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'attendance', component: AttendanceComponent, canActivate: [authGuard] },
  { path: 'policies', component: PoliciesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
