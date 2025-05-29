/**
 * Interface représentant une paire rôle-compétence
 * Contient le rôle, les compétences associées et une description du rôle
 */
export interface RoleSkill {
  role: string
  skill: string[]
  description: string
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
  domains: string[];
  role_skills: RoleSkill[];
}

export interface Role {
  role: string;
  description: string;
}





// ================================ Model de recuperation ===========================================================
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
}

export interface ProjectData {
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

