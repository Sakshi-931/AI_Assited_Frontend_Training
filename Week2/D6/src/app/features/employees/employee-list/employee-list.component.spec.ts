import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';

const mockEmployees: Employee[] = [
  {
    id: 101,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    salary: 1250000,
    joiningDate: '2022-03-15',
  },
  {
    id: 102,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    department: 'Design',
    designation: 'Lead Product Designer',
    salary: 1100000,
    joiningDate: '2021-07-01',
  },
];

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };
  let employeeServiceMock: {
    getEmployees: ReturnType<typeof vi.fn>;
    deleteEmployee: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    routerSpy = { navigate: vi.fn() };
    employeeServiceMock = {
      getEmployees: vi.fn().mockReturnValue(of(mockEmployees)),
      deleteEmployee: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerSpy },
        { provide: EmployeeService, useValue: employeeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component with initial card view signal', () => {
    expect(component).toBeTruthy();
    expect(component.viewMode()).toBe('card');
    expect(component.employees().length).toBe(mockEmployees.length);
  });

  it('should switch view mode when toggle buttons are clicked', () => {
    component.setViewMode('row');
    expect(component.viewMode()).toBe('row');

    component.setViewMode('card');
    expect(component.viewMode()).toBe('card');
  });

  it('should query child cards via signal query viewChildren in card view', () => {
    fixture.detectChanges();
    expect(component.employeeCards().length).toBe(mockEmployees.length);
    expect(component.renderedCount()).toBe(mockEmployees.length);
  });

  it('should navigate to employee details with correct ID', () => {
    component.navigateToDetails(101);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/employees', 101]);
  });

  it('should remove employee from list signal and call employeeService.deleteEmployee on onDeleteEmployee', () => {
    expect(component.employees().length).toBe(2);

    component.onDeleteEmployee(101);

    expect(component.employees().length).toBe(1);
    expect(component.employees().some((e) => e.id === 101)).toBe(false);
    expect(employeeServiceMock.deleteEmployee).toHaveBeenCalledWith(101);
  });
});
