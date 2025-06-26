import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { UserLocalService } from './user-local.service';
import { Environment } from 'environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  // Ajoute ici les propriétés utiles que ton API renvoie
}

@Injectable({ providedIn: 'root' })
export class FollowService {
  private apiUrl = Environment.apiUrl;
  private userService = inject(UserLocalService);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  follow(userId: number): Observable<{ message: string; is_following: boolean }> {
    return this.http.post<{ message: string; is_following: boolean }>(
      `${this.apiUrl}/users/${userId}/follow`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  unfollow(userId: number): Observable<{ message: string; is_following: boolean }> {
    return this.http.post<{ message: string; is_following: boolean }>(
      `${this.apiUrl}/users/${userId}/unfollow`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  isFollowing(userId: number): Observable<{ is_following: boolean }> {
    return this.http.get<{ is_following: boolean }>(
      `${this.apiUrl}/users/${userId}/is-following`,
      { headers: this.getAuthHeaders() }
    );
  }

  getFollowers(userId: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}/users/${userId}/followers`,
      { headers: this.getAuthHeaders() }
    );
  }

  getFollowing(userId: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}/users/${userId}/following`,
      { headers: this.getAuthHeaders() }
    );
  }

  getFollowCounts(userId: number): Observable<{ 
    followers_count: number; 
    following_count: number; 
    total_connections : number 
  }> {
    return this.http.get<{ 
      followers_count: number; 
      following_count: number;
      total_connections : number
    }>(
      `${this.apiUrl}/users/${userId}/follow-counts`,
      { headers: this.getAuthHeaders() }
    );
  }
  getSuggestions(): Observable<User[]> {
  return this.http.get<User[]>(
    `${this.apiUrl}/users/suggestions`,
    { headers: this.getAuthHeaders() }
  );
}

}
