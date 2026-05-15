import { EnrollmentWithCourse } from './enrollment.model';
import { Lesson } from './lesson.model';

export interface Course {
  id: number;
  title: string;
  slug?: string;
  shortDescription?: string;
  description: string;
  categoryId?: number;
  category: string;
  level: string;
  requiredPlanId?: number;
  requiredPlan: string;
  image: string;
  tags: string[];
  isPopular: boolean;
  instructor: string;
  durationHours: number;
  lessonsCount: number;
  createdAt?: string;
}

export interface CourseAccess {
  hasAccess: boolean;
  isAuthenticated: boolean;
  requiresAuthentication: boolean;
  requiresUpgrade: boolean;
  currentPlanId: number | null;
  requiredPlanId: number | null;
  requiredPlan: string | null;
}

export interface CourseDetailResponse {
  course: Course;
  outcomes: string[];
  lessons: Lesson[];
  enrollment: EnrollmentWithCourse | null;
  access?: CourseAccess;
}
