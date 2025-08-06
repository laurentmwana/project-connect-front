import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private baseUrl = 'http://localhost:8000/api/invitations/candidacies '

  constructor(private http: HttpClient) {}

  getUserInvitations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidacies`);
  }

  respondToInvitation(candidacyId: number, status: 'accepted' | 'declined'): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidacies/${candidacyId}`, { status });
  }
}
