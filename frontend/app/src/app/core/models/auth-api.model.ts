import { User } from './user.model';
import { Plan } from './plan.model';

export interface AuthUserResponse {
  success: boolean;
  message: string;
  user: User;
  token?: string;
}

export interface ApiSuccessResponse {
  success: boolean;
  message: string;
}

export interface TagDto {
  id: number;
  name: string;
}

export interface TagsResponse {
  success: boolean;
  message: string;
  data: {
    tags: TagDto[];
  };
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tags: TagDto[];
    plans: Plan[];
  };
}

export interface ApiErrorResponse {
  success?: boolean;
  message: string;
  error?: string;
}
