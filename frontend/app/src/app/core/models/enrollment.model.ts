import { Course } from './course.model';

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  enrolledAt: string;
  completedAt?: string | null;
}

export interface EnrollmentWithCourse extends Enrollment {
  course?: Course | null;
}
