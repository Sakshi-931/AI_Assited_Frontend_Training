import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeCardComponent } from './employee-card.component';
import { Employee } from '../../../core/models/employee.model';

describe('EmployeeCardComponent', () => {
  let component: EmployeeCardComponent;
  let fixture: ComponentFixture<EmployeeCardComponent>;

  const mockEmployee: Employee = {
    id: 101,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    salary: 1250000,
    joiningDate: '2022-03-15',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeCardComponent);
    component = fixture.componentInstance;
    component.employee = mockEmployee;
    fixture.detectChanges();
  });

  it('should render employee name and designation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.emp-name')?.textContent).toContain('Aarav Sharma');
    expect(compiled.querySelector('.emp-designation')?.textContent).toContain('Senior Frontend Engineer');
  });

  it('should format salary with currency pipe and department in uppercase', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.department-badge')?.textContent).toContain('ENGINEERING');
    expect(compiled.querySelector('.emp-salary')?.textContent).toContain('₹1,250,000');
  });

  it('should emit viewDetails event when button is clicked', () => {
    let emittedId: number | undefined;
    component.viewDetails.subscribe((id) => (emittedId = id));

    const button = fixture.nativeElement.querySelector('.details-btn') as HTMLButtonElement;
    button.click();

    expect(emittedId).toBe(101);
  });

  it('should emit deleteEmployee event when delete button is clicked', () => {
    let deletedId: number | undefined;
    component.deleteEmployee.subscribe((id) => (deletedId = id));

    const button = fixture.nativeElement.querySelector('.delete-btn') as HTMLButtonElement;
    button.click();

    expect(deletedId).toBe(101);
  });
});
