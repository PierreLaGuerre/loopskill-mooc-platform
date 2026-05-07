import { EnrollmentWithCourse } from './enrollment.model';
import { Lesson } from './lesson.model';

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  requiredPlan: string;
  image: string;
  tags: string[];
  isPopular: boolean;
  instructor: string;
  durationHours: number;
  lessonsCount: number;
}

export interface CourseOutcome {
  id: number;
  courseId: number;
  text: string;
  displayOrder: number;
}

export interface CourseDetailResponse {
  course: Course;
  outcomes: CourseOutcome[];
  lessons: Lesson[];
  enrollment: EnrollmentWithCourse | null;
}
