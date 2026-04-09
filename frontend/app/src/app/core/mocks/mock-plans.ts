import { Plan } from '../models/plan.model';

export const MOCK_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    description: 'Start learning with access to essential courses and core platform features.',
    features: [
      'Access to beginner courses',
      'Personalized recommendations',
      'Progress tracking',
      'Learning dashboard'
    ]
  },
  {
    id: 2,
    name: 'Pro',
    price: 12.99,
    description: 'Unlock a wider catalog with intermediate content and a more complete learning experience.',
    features: [
      'Everything in Free',
      'Access to intermediate courses',
      'Expanded course catalog',
      'Priority access to new content',
      'More advanced learning paths'
    ],
    recommended: true
  },
  {
    id: 3,
    name: 'Premium',
    price: 24.99,
    description: 'Get full access to the complete catalog and premium learning features.',
    features: [
      'Everything in Pro',
      'Access to advanced courses',
      'Full catalog access',
      'Premium learning experience',
      'Priority support'
    ]
  }
];