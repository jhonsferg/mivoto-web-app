export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'VOTER';
  documentNumber?: string;
  active?: boolean;
  lastLogin?: string;
}
