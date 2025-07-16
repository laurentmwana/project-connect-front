import { AuthenticatedUser } from '@/model/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  async findAll(user: AuthenticatedUser, filter: string) {
    const url = `${Environment.apiUrl}/notifications?filter=${filter}`;

    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  async findLast(user: AuthenticatedUser) {
    const url = `${Environment.apiUrl}/last-notification`;

    return this.http.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  async find(user: AuthenticatedUser, notificationId: string) {
    const url = `${Environment.apiUrl}/notification/${notificationId}`;

    return this.http.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  async markAsRead(user: AuthenticatedUser) {
    const url = `${Environment.apiUrl}/mark-as-read/notification`;

    return this.http.post(url, null, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
}
