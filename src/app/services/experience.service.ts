import { Experience } from './../model/experience';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLocalService } from './user-local.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  private apiUrl = 'http://127.0.0.1:8000/api/experiences';

  constructor(private http: HttpClient, private userLocalService : UserLocalService) {}




  /**
   * Récuperer les experiences d'un user 
   * 
   */
  getExperiences(userId?:number| null): Observable<{data : Experience[]}>{
    const user = this.userLocalService.getUser();
    let url= userId? `${this.apiUrl}?user_id=${userId}`: this.apiUrl
    return this.http.get<{data : Experience[]}>(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
  }



  /**
   * Récupère tous les experiences, ou ceux d'un utilisateur spécifique si un ID est fourni
   */
  getExperience(userId?: number): Observable<any> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('user_id', userId.toString());
    }

    return this.http.get(this.apiUrl, { params });
  }

  /**
   * Récupère un experience précis via son ID
   */
  getExperienceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau experience avec les données envoyées
   */
  createExperience(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  /**
   * Supprime un Experience via son ID
   */
  deleteExperience(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
