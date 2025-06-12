import { UserLocalService } from '@/services/user-local.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { PaginatedProjects, Project, ProjectData } from '../model/project';
import { Domain } from '@/model/domain';
import { Role } from '@/model/role';
import { Skill } from '@/model/skill';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // ✅ URL de base corrigée (pas de doublon 'projects')
  private baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(
    private http: HttpClient,
    private userLocalService: UserLocalService
  ) {}

  getAllProjects(
    page: number = 1,
    searchTerm: string = ''
  ): Observable<PaginatedProjects> {
    let url = `${this.baseUrl}projects?page=${page}`;

    if (searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    return this.http.get<PaginatedProjects>(url);
  }

  /**
   * Crée un nouveau projet
   */
  createProject(data: Project): Observable<any> {
    const user = this.userLocalService.getUser();

    return this.http.post(this.baseUrl + 'projects', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
  }

  //modifier un projet

  updateProject(id: string, data: any): Observable<any> {
    const user = this.userLocalService.getUser();

    return this.http.put(`${this.baseUrl}projects/${id}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
  }

  /**
   * Récupère un projet par ID
   */

  getProjectById(id: string) {
    return this.http.get<{ data: ProjectData }>(
      `http://127.0.0.1:8000/api/projects/${id}`
    );
  }
  getProject(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}projects/${id}`);
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
