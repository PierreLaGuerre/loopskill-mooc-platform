export type PlanName = 'Free' | 'Pro' | 'Premium';

export interface Plan {
  id: number;
  name: PlanName;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
}