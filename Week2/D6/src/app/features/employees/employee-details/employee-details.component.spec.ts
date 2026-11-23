import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { EmployeeDetailsComponent } from './employee-details.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';

const mockEmployee: Employee = {
  id: 101,
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  department: 'Engineering',
  designation: 'Senior Frontend Engineer',
  salary: 1250000,
  joiningDate: '2022-03-15',
};

describe('EmployeeDetailsComponent', () => {
  const createComponentWithRouteId = async (id: string | null) => {
    const foundEmployee = id === '101' ? mockEmployee : null;
    const employeeServiceMock = {
      getEmployeeById: vi.fn().mockReturnValue(of(foundEmployee)),
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeDetailsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: EmployeeService, useValue: employeeServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? id : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(EmployeeDetailsComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should display employee details when a valid employee ID is provided', async () => {
    const fixture = await createComponentWithRouteId('101');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.profile-name')?.textContent).toContain('Aarav Sharma');
    expect(compiled.querySelector('.profile-designation')?.textContent).toContain('Senior Frontend Engineer');
    expect(compiled.querySelector('.salary-highlight')?.textContent).toContain('₹1,250,000');
  });

  it('should display not-found message when employee ID does not exist', async () => {
    TestBed.resetTestingModule();
    const fixture = await createComponentWithRouteId('9999');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.not-found-card')?.textContent).toContain('Employee Not Found');
  });
});
