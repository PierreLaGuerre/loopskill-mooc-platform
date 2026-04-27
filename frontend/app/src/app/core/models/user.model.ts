export type UserRole = 'student' | 'admin';

export type ClientType = 'student' | 'professional' | 'company';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  clientType: ClientType;
  planId: number;
  interests: string[];
}