import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDetailsComponent {
  readonly employee = input.required<Employee>();
}
