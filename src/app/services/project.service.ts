import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Project } from '../model/project';
import { Domain } from '@/model/domain';
import { Environment } from 'environments/environment';
import { Role } from '@/model/role';
import { Skill } from '@/model/skill';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // URL de base de l'API (à remplacer par votre URL réelle)
  private url = `${Environment.apiUrl}/`;

  // Données prédéfinies pour les domaines, rôles et compétences
  private availableDomains: string[] = [];

  private availableRoles: string[] = [];

  private skillsByRole: Record<string, string[]> = {};

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des domaines disponibles
   * @returns Observable contenant la liste des domaines
   */
  getAvailableDomains(): Observable<{ data: Domain[] }> {
    return this.http.get<{ data: Domain[] }>(this.url + 'domains');
  }

  /**
   * Récupère la liste des rôles disponibles
   * @returns Observable contenant la liste des rôles
   */
  getAvailableRoles(): Observable<{ data: Role[] }> {
    return this.http.get<{ data: Role[] }>(this.url + 'roles');
  }

  /**
   * Récupère les compétences associées à un rôle spécifique
   * @param role Le rôle pour lequel récupérer les compétences
   * @returns Observable contenant la liste des compétences pour ce rôle
   */
  getAvaillableSkills(): Observable<{ data: Skill[] }> {
    return this.http.get<{ data: Skill[] }>(this.url + 'skills');
  }

  /**
   * Crée un nouveau projet
   * @param projectData Les données du projet à créer
   * @returns Observable contenant la réponse de l'API
   */
  createProject(data: Project){
    return this.http.post(this.url + 'projects', data);
  };

    // Implémentation réelle avec HttpClient:
    // return this.http.post<any>(this.apiUrl, projectData);
  

  /**
   * Récupère un projet par son ID
   * @param id L'identifiant du projet
   * @returns Observable contenant les données du projet
   */
  getProjectById(id: string): Observable<any> {
    // Dans un environnement réel, cette méthode ferait un appel HTTP GET
    // return this.http.get<ProjectData>(`${this.apiUrl}/${id}`);

    // Pour l'exemple, on retourne un projet vide
    return of({
      title: '',
      description: '',
      date_start: '',
      date_end: '',
      budget: 0,
      location: 'Remote',
      visibility: 'private',
      domains: [],
      role_skills: [],
    });
  }
}
