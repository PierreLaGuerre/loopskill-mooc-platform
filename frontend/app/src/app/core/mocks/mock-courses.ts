import { Course } from '../models/course.model';

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Python for Beginners',
    description: 'Start coding with Python from scratch and build a strong foundation in programming.',
    category: 'Programming',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/python.jpg',
    tags: ['python', 'beginner', 'programming'],
    isPopular: true
  },
  {
    id: 2,
    title: 'Advanced Python',
    description: 'Improve your Python skills with automation, APIs and more advanced development patterns.',
    category: 'Programming',
    level: 'Advanced',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/advanced-python.jpg',
    tags: ['python', 'automation', 'advanced'],
    isPopular: true
  },
  {
    id: 3,
    title: 'SQL Fundamentals',
    description: 'Learn how to query databases, filter data and build a solid SQL foundation.',
    category: 'Databases',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/sql.jpg',
    tags: ['sql', 'databases', 'queries'],
    isPopular: true
  },
  {
    id: 4,
    title: 'Power BI Essentials',
    description: 'Create dashboards and transform data into useful business insights with Power BI.',
    category: 'Data Analysis',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/powerbi.jpg',
    tags: ['power-bi', 'dashboards', 'data-visualization'],
    isPopular: true
  },
  {
    id: 5,
    title: 'Frontend Development Basics',
    description: 'Learn the foundations of HTML, CSS and JavaScript to build modern web pages.',
    category: 'Web Development',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/frontend.jpg',
    tags: ['html', 'css', 'javascript'],
    isPopular: false
  },
  {
    id: 6,
    title: 'Angular from Zero',
    description: 'Build scalable frontend applications using Angular and TypeScript step by step.',
    category: 'Web Development',
    level: 'Intermediate',
    requiredPlan: 'Premium',
    image: 'assets/images/courses/angular.jpg',
    tags: ['angular', 'typescript', 'frontend'],
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