import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [HighlightDirective, CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCardComponent {
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
