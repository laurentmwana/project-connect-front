import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';
import { Project, ProjectData } from '../model/project';
import { Domain } from '@/model/domain';
import { Role } from '@/model/role';
import { Skill } from '@/model/skill';
import { Environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // URL de base de l'API
  private url = 'http://127.0.0.1:8000/api/projects';

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des projets
   */
  getAllProjects(): Observable<ProjectData[]> {
    return this.http.get<ProjectData[]>(this.url + 'projects');
  }

  /**
   * Crée un nouveau projet
   */
  createProject(data: Project): Observable<any> {
    return this.http.post(this.url + 'projects', data);
  }

  /**
   * Récupère un projet par ID
   */
  getProjectById(id: string): Observable<ProjectData> {
    return this.http.get<ProjectData>(`${this.url}projects/${id}`);
  }

  /**
   * Récupère les domaines disponibles
   */
  getAvailableDomains(): Observable<{ data: Domain[] }> {
    return this.http.get<{ data: Domain[] }>(this.url + 'domains');
  }

  /**
   * Récupère les rôles disponibles
   */
  getAvailableRoles(): Observable<{ data: Role[] }> {
    return this.http.get<{ data: Role[] }>(this.url + 'roles');
  }

  /**
   * Récupère les compétences disponibles
   */
  getAvaillableSkills(): Observable<{ data: Skill[] }> {
    return this.http.get<{ data: Skill[] }>(this.url + 'skills');
  }
}

 

