import { Category } from '../models/category.model';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Programming',
    icon: 'assets/images/categories/programming.png',
    description: 'Build strong coding foundations with modern development skills.'
  },
  {
    id: 2,
    name: 'Databases',
    icon: 'assets/images/categories/databases.png',
    description: 'Learn to design, query and manage structured data efficiently.'
  },
  {
    id: 3,
    name: 'Cloud',
    icon: 'assets/images/categories/cloud.png',
    description: 'Explore cloud platforms, deployment basics and scalable services.'
  },
  {
    id: 4,
    name: 'Data Science',
    icon: 'assets/images/categories/datascience.png',
    description: 'Work with data, discover patterns and create useful analytical insights.'
  },
  {
    id: 5,
    name: 'DevOps',
    icon: 'assets/images/categories/devops.png',
    description: 'Understand automation, delivery workflows and infrastructure practices.'
  }
];