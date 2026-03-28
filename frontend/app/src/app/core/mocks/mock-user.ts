export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student';
  clientType: 'estudiante' | 'profesional' | 'empresa';
  planId: number;
  interests: string[];
}