export type UserRole = 'student' | 'admin';

export type ClientType = 'student' | 'professional' | 'company';

export interface UserPlan {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  clientType: ClientType;
  planId: number;
  plan?: UserPlan | null;
  interests: string[];
}
