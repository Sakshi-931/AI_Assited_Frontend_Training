import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCardComponent {
  // Angular 21 signal-based input
  readonly employee = input.required<Employee>();
}
