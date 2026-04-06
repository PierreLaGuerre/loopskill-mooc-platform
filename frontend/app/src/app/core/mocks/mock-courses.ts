import { Course } from '../models/course.model';

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Python Fundamentals',
    description: 'This course introduces Python programming through practical examples and core programming concepts.',
    category: 'Programming',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/python.png',
    tags: ['python', 'oop'],
    isPopular: true
  },
  {
    id: 2,
    title: 'Java OOP Essentials',
    description: 'Master object-oriented programming concepts with Java and learn how to structure maintainable applications.',
    category: 'Programming',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/java.png',
    tags: ['java', 'oop'],
    isPopular: false
  },
  {
    id: 3,
    title: 'Angular from Scratch',
    description: 'Build modern frontend applications with Angular, components, routing and services.',
    category: 'Programming',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/angular.png',
    tags: ['angular', 'typescript', 'rest api'],
    isPopular: true
  },
  {
  id: 21,
  title: 'Node.js Fundamentals',
  description: 'Learn to build fast and scalable backend applications using Node.js and JavaScript.',
  category: 'Programming',
  level: 'Intermediate',
  requiredPlan: 'Pro',
  image: 'assets/images/courses/node.png',
  tags: ['nodejs', 'backend', 'rest api'],
  isPopular: true
},
  {
    id: 4,
    title: 'React Fundamentals',
    description: 'Create dynamic user interfaces with React using reusable components, hooks and state.',
    category: 'Programming',
    level: 'Intermediate',
    requiredPlan: 'Premium',
    image: 'assets/images/courses/react.png',
    tags: ['react', 'typescript'],
    isPopular: true
  },
  {
    id: 5,
    title: 'SQL Fundamentals',
    description: 'Understand relational databases and write effective SQL queries.',
    category: 'Databases',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/sql.png',
    tags: ['sql'],
    isPopular: true
  },
  {
    id: 6,
    title: 'MySQL Database Design',
    description: 'Design structured relational databases with MySQL, normalization and constraints.',
    category: 'Databases',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/mysql.png',
    tags: ['mysql', 'sql'],
    isPopular: false
  },
  {
    id: 7,
    title: 'PostgreSQL Essentials',
    description: 'Learn PostgreSQL fundamentals, advanced querying and index basics.',
    category: 'Databases',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/postgresql.png',
    tags: ['postgresql', 'sql'],
    isPopular: false
  },
  {
    id: 8,
    title: 'MongoDB Basics',
    description: 'Get started with document databases, collections, documents and querying in MongoDB.',
    category: 'Databases',
    level: 'Intermediate',
    requiredPlan: 'Premium',
    image: 'assets/images/courses/mongodb.png',
    tags: ['mongodb'],
    isPopular: false
  },
  {
    id: 9,
    title: 'AWS Cloud Foundations',
    description: 'Understand the core concepts of cloud computing and key AWS services.',
    category: 'Cloud',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/aws.png',
    tags: ['aws'],
    isPopular: true
  },
  {
    id: 10,
    title: 'Azure for Beginners',
    description: 'Start your cloud journey with Azure and learn the basic architecture concepts.',
    category: 'Cloud',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/azure.png',
    tags: ['azure'],
    isPopular: false
  },
  {
    id: 11,
    title: 'Docker Deployment Basics',
    description: 'Containerize and deploy applications using Docker images, containers and compose.',
    category: 'Cloud',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/docker.png',
    tags: ['docker'],
    isPopular: true
  },
  {
    id: 12,
    title: 'Kubernetes Essentials',
    description: 'Learn orchestration basics with Kubernetes: pods, deployments, services and scaling.',
    category: 'Cloud',
    level: 'Advanced',
    requiredPlan: 'Premium',
    image: 'assets/images/courses/kubernetes.png',
    tags: ['kubernetes', 'docker'],
    isPopular: false
  },
  {
    id: 13,
    title: 'Python for Data Analysis',
    description: 'Use Python to clean, process and analyze data with practical workflows.',
    category: 'Data Science',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/python-data-analysis.png',
    tags: ['python', 'data analysis'],
    isPopular: true
  },
  {
    id: 14,
    title: 'Pandas and NumPy Essentials',
    description: 'Work efficiently with tabular and numerical data using Pandas and NumPy.',
    category: 'Data Science',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/pandas-numpy.png',
    tags: ['pandas', 'numpy', 'data analysis'],
    isPopular: false
  },
  {
    id: 15,
    title: 'Machine Learning Basics',
    description: 'Discover the foundations of machine learning and practical model workflows.',
    category: 'Data Science',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/machine-learning.png',
    tags: ['machine learning', 'python'],
    isPopular: true
  },
  {
    id: 16,
    title: 'Power BI for Data Visualization',
    description: 'Build clear dashboards and communicate insights with Power BI.',
    category: 'Data Science',
    level: 'Intermediate',
    requiredPlan: 'Premium',
    image: 'assets/images/courses/powerbi.png',
    tags: ['power bi', 'data analysis'],
    isPopular: false
  },
  {
    id: 17,
    title: 'Git and GitHub Workflow',
    description: 'Learn version control, branching and collaboration with Git and GitHub.',
    category: 'DevOps',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/github.png',
    tags: ['git', 'github'],
    isPopular: true
  },
  {
    id: 18,
    title: 'Linux for Deployment',
    description: 'Understand the Linux basics needed for server and deployment environments.',
    category: 'DevOps',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/linux.png',
    tags: ['linux'],
    isPopular: false
  },
  {
    id: 19,
    title: 'CI/CD Essentials',
    description: 'Automate software delivery using continuous integration and deployment concepts.',
    category: 'DevOps',
    level: 'Intermediate',
    requiredPlan: 'Pro',
    image: 'assets/images/courses/cicd.png',
    tags: ['ci/cd'],
    isPopular: false
  },
  {
    id: 20,
    title: 'Docker for DevOps',
    description: 'Apply Docker to modern DevOps workflows, automation and environment consistency.',
    category: 'DevOps',
    level: 'Intermediate',
    requiredPlan: 'Premium',
    image: 'assets/images/courses/docker-devops.png',
    tags: ['docker', 'ci/cd'],
    isPopular: true
  }
];