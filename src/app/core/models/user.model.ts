export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'VOTER' | 'SUPERVISOR';
  documentNumber?: string;
  active?: boolean;
  lastLogin?: string;
}
