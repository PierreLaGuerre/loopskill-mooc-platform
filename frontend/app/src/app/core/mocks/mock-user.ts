import { User } from '../models/user.model';

export const MOCK_USER: User = {
  id: 1,
  name: 'Pierre',
  email: 'pierre.guerre@loopskill.com',
  role: 'student',
  clientType: 'profesional',
  planId: 2,
  interests: ['python', 'angular', 'github', 'git', 'nodejs', 'java', 'oop']
};