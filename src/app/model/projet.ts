import { Domain, ProjectRoleSkill, User } from "./project";



export interface getProject {
  id: number;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  budget: string;
  location: string;
  visibility: 'public' | 'private';
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
  domains: Domain[];
  project_roles_skills: ProjectRoleSkill[];
}
