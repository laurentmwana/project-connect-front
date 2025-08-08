import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserLocalService } from './user-local.service';
import { Environment } from 'environments/environment';
import { Skill } from '@/model/skill';
import { UserChangePassword, UserProfile } from '@/model/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = Environment.apiUrl;

  constructor(
    private http: HttpClient,
    private userLocalService: UserLocalService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.userLocalService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProfile(): Observable<UserProfile> {
    return this.http
      .get<{ data: UserProfile }>(`${this.apiUrl}/profile`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          const user = response.data;
          if (user && user.profile_photo) {
            const baseUrl = Environment.apiBaseUrl;
            user.profile_photo = `${baseUrl}/storage/${user.profile_photo}`;
          }
          return user;
        })
      );
  }

  updateProfile(
    data: FormData
  ): Observable<{ message: string; state: 'success' | 'error' }> {
    return this.http.post<{ message: string; state: 'success' | 'error' }>(
      `${this.apiUrl}/profile`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  changePassword(data: UserChangePassword): Observable<{ state: boolean }> {
    return this.http.put<{ state: boolean }>(
      `${this.apiUrl}/profile/change/password`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getProfileById(id: number): Observable<UserProfile> {
    return this.http
      .get<{ user: UserProfile }>(`${this.apiUrl}/profiles/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          const user = response.user;
          if (user && user.profile_photo) {
            const baseUrl = Environment.apiUrl.replace('/api', '');
            user.profile_photo = `${baseUrl}/storage/${user.profile_photo}`;
          }
          return user;
        })
      );
  }

  // methode pour afficher les skills de la personnes
  getmyskill(): Observable<Skill[]> {
    return this.http
      .get<{ data: Skill[] }>(`${this.apiUrl}/skill/user`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          const skill = response.data;
          return skill;
        })
      );
  }
}
