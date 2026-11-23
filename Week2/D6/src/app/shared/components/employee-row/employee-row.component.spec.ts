import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { EmployeeRowComponent } from './employee-row.component';
import { Employee } from '../../../core/models/employee.model';

@Component({
  standalone: true,
  imports: [EmployeeRowComponent],
  template: `
    <table>
      <tbody>
        <tr
          app-employee-row
          [employee]="employee"
          (viewDetails)="onViewDetails($event)"
          (deleteEmployee)="onDeleteEmployee($event)"
        ></tr>
      </tbody>
    </table>
  `,
})
class TestHostComponent {
  employee: Employee = {
    id: 102,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    department: 'Design',
    designation: 'Lead Product Designer',
    salary: 1100000,
    joiningDate: '2021-07-01',
  };
  selectedId?: number;
  deletedId?: number;

  onViewDetails(id: number): void {
    this.selectedId = id;
  }

  onDeleteEmployee(id: number): void {
    this.deletedId = id;
  }
}

describe('EmployeeRowComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render employee row details in table cells', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.emp-name')?.textContent).toContain('Priya Patel');
    expect(compiled.querySelector('.emp-email')?.textContent).toContain('priya.patel@example.com');
    expect(compiled.querySelector('.emp-salary')?.textContent).toContain('₹1,100,000');
  });

  it('should emit viewDetails event when view button is clicked', () => {
    const button = fixture.nativeElement.querySelector('.view-btn') as HTMLButtonElement;
    button.click();

    expect(hostComponent.selectedId).toBe(102);
  });

  it('should emit deleteEmployee event when delete button is clicked', () => {
    const button = fixture.nativeElement.querySelector('.delete-btn') as HTMLButtonElement;
    button.click();

    expect(hostComponent.deletedId).toBe(102);
  });
});
