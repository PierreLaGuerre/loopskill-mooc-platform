import { Course } from '../models/course.model';

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Python for Beginners',
    subtitle: 'Start coding with Python from scratch',
    category: 'Programming',
    level: 'Beginner',
    duration: '12 hours',
    image: 'assets/images/courses/python.jpg',
    tags: ['python', 'programming', 'beginner'],
    isPopular: true
  },
  {
    id: 2,
    title: 'Advanced Python',
    subtitle: 'Improve your Python skills with real projects',
    category: 'Programming',
    level: 'Advanced',
    duration: '18 hours',
    image: 'assets/images/courses/advanced-python.jpg',
    tags: ['python', 'automation', 'advanced'],
    isPopular: true
  },
  {
    id: 3,
    title: 'SQL Fundamentals',
    subtitle: 'Learn databases and SQL queries',
    category: 'Databases',
    level: 'Beginner',
    duration: '10 hours',
    image: 'assets/images/courses/sql.jpg',
    tags: ['sql', 'databases', 'queries'],
    isPopular: true
  },
  {
    id: 4,
    title: 'Power BI Essentials',
    subtitle: 'Build dashboards and visual reports',
    category: 'Data Analysis',
    level: 'Intermediate',
    duration: '9 hours',
    image: 'assets/images/courses/powerbi.jpg',
    tags: ['power-bi', 'dashboards', 'data-visualization'],
    isPopular: true
  },
  {
    id: 5,
    title: 'Frontend Development Basics',
    subtitle: 'HTML, CSS and JavaScript foundations',
    category: 'Web Development',
    level: 'Beginner',
    duration: '14 hours',
    image: 'assets/images/courses/frontend.jpg',
    tags: ['html', 'css', 'javascript', 'frontend'],
    isPopular: false
  },
  {
    id: 6,
    title: 'Angular from Zero',
    subtitle: 'Create modern web applications with Angular',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '16 hours',
    image: 'assets/images/courses/angular.jpg',
    tags: ['angular', 'typescript', 'frontend'],
    isPopular: false
  },
  {
    id: 7,
    title: 'Excel for Data Analysis',
    subtitle: 'Use Excel to clean and analyze data',
    category: 'Data Analysis',
    level: 'Beginner',
    duration: '8 hours',
    image: 'assets/images/courses/excel.jpg',
    tags: ['excel', 'data-analysis', 'spreadsheets'],
    isPopular: false
  },
  {
    id: 8,
    title: 'Introduction to UX/UI Design',
    subtitle: 'Learn the basics of digital product design',
    category: 'Design',
    level: 'Beginner',
    duration: '11 hours',
    image: 'assets/images/courses/ux-ui.jpg',
    tags: ['ux', 'ui', 'design', 'figma'],
    isPopular: false
  }
];