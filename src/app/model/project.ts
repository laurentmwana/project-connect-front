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
  title: string
  description: string
  date_start: string
  date_end: string
  budget: number
  location: string
  visibility: "public" | "private"
  domains: string[]
  role_skills: RoleSkill[]
}

export interface Role{
  role: string,
  description: string
}
