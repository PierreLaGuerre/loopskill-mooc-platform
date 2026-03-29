import { Course } from '../models/course.model';

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Python from Zero',
    description: 'Learn Python from scratch and build a solid foundation in programming.',
    category: 'Programming',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/python.png',
    tags: ['python', 'beginner', 'programming'],
    isPopular: true
  },
  {
    id: 2,
    title: 'Docker Essentials',
    description: 'Learn how to containerize applications with Docker.',
    category: 'DevOps',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/docker-4.jpg',
    tags: ['docker', 'containers', 'devops'],
    isPopular: true
  },
  {
    id: 3,
    title: 'Angular from Zero',
    description: 'Build modern frontend applications with Angular and TypeScript step by step.',
    category: 'Web Development',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/angular2.png',
    tags: ['angular', 'typescript', 'frontend'],
    isPopular: true
  },
  {
    id: 4,
    title: 'Node.js Fundamentals',
    description: 'Learn to build fast and scalable backend applications using Node.js and JavaScript.',
    category: 'Backend Development',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/node.png',
    tags: ['nodejs', 'javascript', 'backend'],
    isPopular: true
  },
{
  id: 5,
  title: 'GitHub Fundamentals',
  description: 'Learn how to manage repositories and control versions with GitHub.',
  category: 'Development Tools',
  level: 'Beginner',
  requiredPlan: 'Free',
  image: 'assets/images/courses/github.png',
  tags: ['github', 'git', 'version-control'],
  isPopular: false
},
{
  id: 6,
  title: 'Java Fundamentals',
  description: 'Learn the core concepts of Java in object-oriented programming.',
  category: 'Programming',
  level: 'Intermediate',
  requiredPlan: 'Premium',
  image: 'assets/images/courses/java2.png',
  tags: ['java', 'oop', 'backend'],
  isPopular: false
},
  {
    id: 7,
    title: 'Excel for Data Analysis',
    description: 'Use Excel tools and formulas to clean, organize and analyze data efficiently.',
    category: 'Data Analysis',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/excel.jpg',
    tags: ['excel', 'data-analysis', 'spreadsheets'],
    isPopular: false
  },
  {
    id: 8,
    title: 'Introduction to UX/UI Design',
    description: 'Discover the basics of user experience and interface design for digital products.',
    category: 'Design',
    level: 'Beginner',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/ux-ui.jpg',
    tags: ['ux', 'ui', 'design'],
    isPopular: false
  }
];