export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  duration: string | null;
  videoUrl: string | null;
  displayOrder: number;
}
