import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Project, ProjectData } from '../model/project';
import { Domain } from '@/model/domain';
import { Role } from '@/model/role';
import { Skill } from '@/model/skill';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // ✅ URL de base corrigée (pas de doublon 'projects')
  private baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des projets
   */
  getAllProjects(): Observable<ProjectData[]> {
    return this.http
      .get<{ data: ProjectData[] }>(this.baseUrl + 'projects')
      .pipe(
        map((response) => response.data) // <- extrait le tableau depuis `data`
      );
  }

  /**
   * Crée un nouveau projet
   */
  createProject(data: Project): Observable<any> {
    return this.http.post(this.baseUrl + 'projects', data);
  }

  /**
   * Récupère un projet par ID
   */
  // getProjectById(id: string): Observable<ProjectData> {
  //   return this.http.get<ProjectData>(this.baseUrl + 'projects/' + id);
  // }
  getProjectById(id: string) {
    return this.http.get<{ data: ProjectData }>(
      `http://127.0.0.1:8000/api/projects/${id}`
    );
  }
  /**
   * Récupère les domaines disponibles
   */
  getAvailableDomains(): Observable<{ data: Domain[] }> {
    return this.http.get<{ data: Domain[] }>(this.baseUrl + 'domains');
  }

  /**
   * Récupère les rôles disponibles
   */
  getAvailableRoles(): Observable<{ data: Role[] }> {
    return this.http.get<{ data: Role[] }>(this.baseUrl + 'roles');
  }

  /**
   * Récupère les compétences disponibles
   */
  getAvaillableSkills(): Observable<{ data: Skill[] }> {
    return this.http.get<{ data: Skill[] }>(this.baseUrl + 'skills');
  }
}
