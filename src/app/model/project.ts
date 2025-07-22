/**
 * Interface représentant une paire rôle-compétence
 * Contient le rôle, les compétences associées et une description du rôle
 */
export interface RoleSkill {
  role: string;
  skill: string[];
  description: string;
}

/**
 * Interface principale représentant les données d'un projet
 * Contient toutes les informations nécessaires pour créer ou mettre à jour un projet
 */
export interface Project {
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  budget: number;
  location: string;
  visibility: 'public' | 'private';
  domains: Domain[];
  role_skills: RoleSkill[];
}

export interface Role {
  role: string;
  description: string;
}

// ================================ Modèle principal basé sur la réponse du backend ================================

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Domain {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface ProjectRoleSkill {
  id: number;
  description?: string;
  role: Role;
  skills: Skill[];
  candidacies_count: number;
  invitations_count: number;
}

export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  status: Status;
  description: string;
  date_start: string; // ou Date si vous transformez après
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
  total_candidacies_count: number;
  total_pending_invitation: number;
}

// interface pour la pagination des projects sur lesquels il a participer
export interface PaginatedProjectsParticiped {
  data: Project[];
  meta: Meta;
  links: Links;
}

export interface PaginatedProjects {
  data: ProjectData[];
  meta: Meta;
  links: Links;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface Status {
  name: string;

  created_at: string;
  updated_at: string;
}
