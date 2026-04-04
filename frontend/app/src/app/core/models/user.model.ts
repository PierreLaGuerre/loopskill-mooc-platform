export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  clientType: string;
  planId: number;
  interests: string[];
}