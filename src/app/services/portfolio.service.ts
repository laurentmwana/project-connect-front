import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Portfolio } from '@/model/portfolio';
import { UserLocalService } from './user-local.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private apiUrl = 'http://127.0.0.1:8000/api/myPortfolio';

  constructor(private http: HttpClient, private userLocalService : UserLocalService) {}




  /**
   * Récuperer les portofolios d'un user 
   * 
   */
  getMyPortofolios(): Observable<{data : Portfolio[]}>{
    const user = this.userLocalService.getUser();
    return this.http.get<{data : Portfolio[]}>(this.apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
  }



  /**
   * Récupère tous les portfolios, ou ceux d'un utilisateur spécifique si un ID est fourni
   */
  getPortfolios(userId?: number): Observable<any> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('user_id', userId.toString());
    }

    return this.http.get(this.apiUrl, { params });
  }

  /**
   * Récupère un portfolio précis via son ID
   */
  getPortfolioById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau portfolio avec les données envoyées
   */
  createPortfolio(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  /**
   * Supprime un portfolio via son ID
   */
  deletePortfolio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
