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