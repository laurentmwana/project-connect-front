import { UserLocalService } from '@/services/user-local.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { PaginatedProjects, Project, ProjectData } from '../model/project';
import { Domain } from '@/model/domain';
import { Role } from '@/model/role';
import { Skill } from '@/model/skill';
import { PaginationDataResponse } from '@/model/paginate';

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
  ): Observable<PaginationDataResponse<ProjectData[]>> {
    let url = `${this.baseUrl}projects?page=${page}`;

    if (searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    return this.http.get<PaginationDataResponse<ProjectData[]>>(url);
  }

  /**
   *
   * @param page
   * @param searchTerm
   * @returns
   */
  getAllUserProject(
    page: number = 1,
    searchTerm: string = ''
  ): Observable<PaginatedProjects> {
    let url = `${this.baseUrl}users/projects?page=${page}`;
    const user = this.userLocalService.getUser();

    if (searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    return this.http.get<PaginatedProjects>(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
  }

  // méthode pour recuperer les prjets sur lesquels l'utilisateur a participer
  getProjectParticiped(): Observable<Project[]> {
    const user = this.userLocalService.getUser();

    return this.http
      .get<{ data: Project[] }>(`${this.baseUrl}users_projects_participed`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .pipe(map((response) => response.data));
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

  updateProject(slug: string, data: any): Observable<any> {
    const user = this.userLocalService.getUser();

    return this.http.put(`${this.baseUrl}projects/${slug}`, data, {
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

  getProjectBySlug(slug: string) {
    return this.http.get<{ data: ProjectData }>(
      `http://127.0.0.1:8000/api/projects/${slug}`
    );
  }
  getProject(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}projects/${slug}`);
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
