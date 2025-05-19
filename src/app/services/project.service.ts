import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // URL de base de l'API (à remplacer par votre URL réelle)
  private apiUrl = 'https://api.example.com/projects';

  // Données prédéfinies pour les domaines, rôles et compétences
  private availableDomains: string[] = [];

  private availableRoles: string[] = [];

  private skillsByRole: Record<string, string[]> = {};

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des domaines disponibles
   * @returns Observable contenant la liste des domaines
   */
  getAvailableDomains(): Observable<string[]> {
    return of(this.availableDomains);
  }

  /**
   * Récupère la liste des rôles disponibles
   * @returns Observable contenant la liste des rôles
   */
  getAvailableRoles(): Observable<string[]> {
    return of(this.availableRoles);
  }

  /**
   * Récupère les compétences associées à un rôle spécifique
   * @param role Le rôle pour lequel récupérer les compétences
   * @returns Observable contenant la liste des compétences pour ce rôle
   */
  getSkillsByRole(role: string): Observable<string[]> {
    return of(this.skillsByRole[role] || []);
  }

  /**
   * Crée un nouveau projet
   * @param projectData Les données du projet à créer
   * @returns Observable contenant la réponse de l'API
   */
  createProject(projectData: Project): Observable<any> {
    // Dans un environnement réel, cette méthode ferait un appel HTTP POST
    console.log('Création du projet:', projectData);

    // Simulation d'un appel API réussi
    return of({
      success: true,
      message: 'Projet créé avec succès',
      data: projectData,
    });

    // Implémentation réelle avec HttpClient:
    // return this.http.post<any>(this.apiUrl, projectData);
  }

  /**
   * Récupère un projet par son ID
   * @param id L'identifiant du projet
   * @returns Observable contenant les données du projet
   */
  getProjectById(id: string): Observable<Project> {
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
