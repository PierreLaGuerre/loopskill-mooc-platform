import { Category } from '../models/category.model';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Programming',
    description: 'Build strong coding foundations with modern development skills.',
    icon: 'assets/images/categories/programming.png'
  },
  {
    id: 2,
    name: 'Databases',
    description: 'Learn to design, query and manage structured data efficiently.',
    icon: 'assets/images/categories/databases.png'
  },
  {
    id: 3,
    name: 'Cloud',
    description: 'Explore cloud platforms, deployment basics and scalable services.',
    icon: 'assets/images/categories/cloud.png'
  },
  {
    id: 4,
    name: 'Data Science',
    description: 'Work with data, discover patterns and create useful analytical insights.',
    icon: 'assets/images/categories/datascience.png'
  },
  {
    id: 5,
    name: 'DevOps',
    description: 'Understand automation, delivery workflows and infrastructure practices.',
    icon: 'assets/images/categories/devops.png'
  }
];