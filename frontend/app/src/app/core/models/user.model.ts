export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  clientType: string;
  planId: number;
  interests: string[];
}