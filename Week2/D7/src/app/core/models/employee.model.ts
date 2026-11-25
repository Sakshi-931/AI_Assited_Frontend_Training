export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl: string;
  joiningDate: string; // ISO date string: YYYY-MM-DD
  bloodGroup: string;
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say';
  dob: string;        // ISO date string: YYYY-MM-DD
  address: string;
}

export interface EmergencyContact {
  id: string;
  employeeId: string;
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface FamilyMember {
  id: string;
  employeeId: string;
  name: string;
  relationship: string;
  phone: string;
}

