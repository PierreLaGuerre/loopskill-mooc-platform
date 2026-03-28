export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredPlan: 'Free' | 'Pro' | 'Premium';
  image: string;
  tags: string[];
  isPopular: boolean;
}