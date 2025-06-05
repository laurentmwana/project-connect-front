import { Role, User } from "./project";

export interface CandidacyResponse {
  message: string;
  meta: Meta;
  filters: any[]; // À affiner si tu sais le format des filtres
  data: Candidacy[];
}

export interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  links: MetaLinks;
}

export interface MetaLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Candidacy {
  id: number;
  is_validated: number;
  created_at: string;
  user: User;
  project_role: ProjectRole;
}


export interface ProjectRole {
  id: number;
  description: string;
  role: Role;
}


