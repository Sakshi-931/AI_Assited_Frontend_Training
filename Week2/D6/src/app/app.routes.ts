import { Routes } from '@angular/router';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './features/employees/employee-details/employee-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full',
  },
  {
    path: 'employees',
    component: EmployeeListComponent,
  },
  {
    path: 'employees/:id',
    component: EmployeeDetailsComponent,
  },
  {
    path: '**',
    redirectTo: 'employees',
  },
];
