import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);

  readonly employee = signal<Employee | null>(null);
  readonly loading = signal<boolean>(true);

  readonly detailsCard = viewChild<ElementRef<HTMLElement>>('detailsCard');

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const employeeId = idParam ? Number(idParam) : null;

    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (emp) => {
          this.employee.set(emp);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }
}