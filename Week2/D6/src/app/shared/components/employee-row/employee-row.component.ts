import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'tr[app-employee-row]',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './employee-row.component.html',
  styleUrl: './employee-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeRowComponent {
  @Input({ required: true }) employee!: Employee;
  @Output() viewDetails = new EventEmitter<number>();
  @Output() deleteEmployee = new EventEmitter<number>();

  onViewClick(): void {
    this.viewDetails.emit(this.employee.id);
  }

  onDeleteClick(): void {
    this.deleteEmployee.emit(this.employee.id);
  }
}
