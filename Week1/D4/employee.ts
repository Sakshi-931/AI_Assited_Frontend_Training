export type Department =
  | 'Engineering'
  | 'Product'
  | 'Design'
  | 'Human Resources'
  | 'Analytics'
  | 'Marketing'
  | 'Finance';

export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave';

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: Department;
  email: string;
  phone: string;
  location: string;
  status: EmployeeStatus;
  joinedDate: string

  avatar?: string;
  skills?: string[];
  bio?: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id'>;

export interface EmployeeFilterCriteria {
  searchTerm?: string;
  department?: Department | 'All';
  status?: EmployeeStatus | 'All';
  location?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function filterEmployees(
  employees: Employee[],
  criteria: EmployeeFilterCriteria
): Employee[] {
  return employees.filter((emp) => {
    const matchesSearch = criteria.searchTerm
      ? emp.name.toLowerCase().includes(criteria.searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(criteria.searchTerm.toLowerCase())
      : true;

    const matchesDept =
      !criteria.department || criteria.department === 'All'
        ? true
        : emp.department === criteria.department;
    const matchesStatus =
      !criteria.status || criteria.status === 'All'
        ? true
        : emp.status === criteria.status;

    return matchesSearch && matchesDept && matchesStatus;
  });
}

export function sortByProperty<T>(items: T[], key: keyof T, ascending: boolean = true): T[] {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
}

export const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'Aarav Sharma',
    role: 'Lead Software Engineer',
    department: 'Engineering',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru',
    status: 'Active',
    joinedDate: '2021-03-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skills: ['TypeScript', 'Angular', 'Node.js']
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Senior Product Manager',
    department: 'Product',
    email: 'priya.patel@example.com',
    phone: '+91 98123 45678',
    location: 'Mumbai',
    status: 'Active',
    joinedDate: '2020-07-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    skills: ['Agile', 'Scrum', 'Product Strategy']
  },
  {
    id: 3,
    name: 'Ananya Iyer',
    role: 'UI/UX Designer',
    department: 'Design',
    email: 'ananya.iyer@example.com',
    phone: '+91 96345 67890',
    location: 'Chennai',
    status: 'On Leave',
    joinedDate: '2021-11-20',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    skills: ['Figma', 'CSS', 'User Research']
  },
  {
    id: 4,
    name: 'Aditya Verma',
    role: 'Data Analyst',
    department: 'Analytics',
    email: 'aditya.verma@example.com',
    phone: '+91 93678 90123',
    location: 'Bengaluru',
    status: 'Inactive',
    joinedDate: '2023-02-01'
  }
];

// DAY 4 PRACTICE EXERCISES: FIND AND FIX THE TYPESCRIPT ERRORS

// EXERCISE 1: Union Type Mismatch & Missing Required Property
export const exercise1Employee: Employee = {
  id: 5,
  name: 'Karan Joshi',
  role: 'Backend Developer',
  department: 'Engineering',
  email: 'karan.joshi@example.com',
  phone: '+91 91234 56780',
  location: 'Pune',
  joinedDate: '2023-05-10',
  status: 'Active'
};

// EXERCISE 2: Array Type Mismatch
export const exercise2Employee: Employee = {
  id: 6,
  name: 'Meera Nair',
  role: 'Frontend Engineer',
  department: 'Engineering',
  email: 'meera.nair@example.com',
  phone: '+91 97654 32109',
  location: 'Bengaluru',
  status: 'Active',
  joinedDate: '2022-09-01',
  skills: ['HTML', 'CSS', 'TypeScript']
};

// EXERCISE 3: Function Argument Type Mismatch
export const exercise3Result = filterEmployees(
  initialEmployees,
  { department: 'Engineering' }
);

// EXERCISE 4: Generics Type Mismatch with ApiResponse<T>
export const exercise4Response: ApiResponse<Employee[]> = {
  success: true,
  statusCode: 200,
  message: 'Employee fetched successfully',
  data: initialEmployees,
  timestamp: new Date().toISOString()
};

// EXERCISE 5: Generic keyof Constraint Error with sortByProperty<T>
export const exercise5Sorted = sortByProperty(
  initialEmployees,
  'id'
);

// EXERCISE 6: Excess Property / Unknown Field
export const exercise6Employee: Employee = {
  id: 7,
  name: 'Tanvi Shah',
  role: 'Quality Analyst',
  department: 'Engineering',
  email: 'tanvi.shah@example.com',
  phone: '+91 99887 76655',
  location: 'Pune',
  status: 'Active',
  joinedDate: '2023-01-15'
};

// EXERCISE 7: Function Return Type Mismatch
export function isEmployeeActive(emp: Employee): boolean {
  return emp.status === 'Active';
}

// EXERCISE 8: Function Call Missing Required Parameter
export function formatEmployeeDisplay(emp: Employee, includePhone: boolean): string {
  return `${emp.name} (${emp.role}) - ${includePhone ? emp.phone : emp.email}`;
}

// Calling formatEmployeeDisplay with missing argument:
export const exercise8Display = formatEmployeeDisplay(initialEmployees[0], true);

// EXERCISE 9: Utility Type Omit<T, K> Excess Property
export const exercise9NewEmployee: CreateEmployeeInput = {
  name: 'Rajesh Kumar',
  role: 'DevOps Engineer',
  department: 'Engineering',
  email: 'rajesh.kumar@example.com',
  phone: '+91 98760 12345',
  location: 'Hyderabad',
  status: 'Active',
  joinedDate: '2023-06-01'
};

// EXERCISE 10: Array Push Type Incompatibility
export const teamMembers: Partial<Employee>[] = [...initialEmployees];
teamMembers.push({
  name: 'Sunil Gavaskar'
});

// EXERCISE 11: Tuple Size & Type Error
export type Coordinates = [number, number];

export const officeLocation: Coordinates = [18.5204, 73.8567];

// EXERCISE 12: Generic Constraint (extends) Violation
export function getEntityId<T extends { id: number }>(item: T): number {
  return item.id;
}

export const departmentInfo = { name: 'Human Resources', code: 'HR', id: 10 };
export const exercise12Id = getEntityId(departmentInfo);

// EXERCISE 13: Generic Interface Type Mismatch in PaginatedResult<T>
export const paginatedEmployees: PaginatedResult<Employee> = {
  items: initialEmployees,
  total: 4,
  page: 1,
  limit: 10,
  totalPages: 1
};

// EXERCISE 14: Readonly Property Mutation
export const permanentEmployee: Readonly<Employee> = initialEmployees[0];
const updatedEmployee: Employee = {
  ...permanentEmployee,
  status: 'Inactive'
};

// EXERCISE 15: Type Narrowing / Union Type Guard
export type RoleLevel = number | 'Junior' | 'Senior' | 'Lead';

export function formatRoleLevel(level: RoleLevel): string {
  if (typeof level === 'number') {
    return `Level: ${level.toFixed(1)}`;
  }
  return `Level: ${level}`;
}