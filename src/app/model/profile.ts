import { Skill } from './skill';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  job_title: string | null;
  userId: number;
  phone: string | null;
  about: string | null;
  location: string | null;
  portfolio_url: string | null;
  is_availability: string | null;
  profile_photo: string | null;
  skills?: Skill[];
  created_at: string | null;
  updated_at: string | null;
}


export interface UserChangePassword {
  current_password: string
  password: string
  password_confirmation: string
}
