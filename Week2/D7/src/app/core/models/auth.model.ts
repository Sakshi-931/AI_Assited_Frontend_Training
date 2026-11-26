export interface AuthUser {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
