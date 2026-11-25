export interface CompanyPolicy {
  id: string;
  title: string;
  description: string;
  category: 'Workplace' | 'Benefits & Leave' | 'Compliance & IT' | 'General';
  lastUpdated: string; // ISO date string: YYYY-MM-DD
}
