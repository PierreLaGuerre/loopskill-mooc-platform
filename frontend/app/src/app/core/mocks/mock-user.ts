import { User } from '../models/user.model';

export const MOCK_USER: User = {
  id: 1,
  name: 'Pierre',
  email: 'pierre.guerre@loopskill.com',
  password: '1234',
  role: 'student',
  clientType: 'professional',
  planId: 2,
  interests: ['python', 'angular', 'github', 'git', 'nodejs', 'java', 'docker']
};

export const MOCK_ADMIN_USER: User = {
  id: 2,
  name: 'Alejandro Martin',
  email: 'alejandro.martin@loopskill.com',
  password: '1234',
  role: 'admin',
  clientType: 'professional',
  planId: 3,
  interests: ['Angular', 'AWS', 'SQL']
};