export interface Course {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  image: string;
  tags: string[];
  isPopular: boolean;
}