import { AuthenticatedUser } from '@/model/auth';
import { Injectable } from '@angular/core';

const SESSION_KEY = 'SESSION_USER';

@Injectable({
  providedIn: 'root',
})
export class UserLocalService {
  constructor() {}

  getUser(): AuthenticatedUser | null {
    const data = localStorage.getItem(SESSION_KEY);

    if (!data) return null;

    const user: AuthenticatedUser = JSON.parse(data);

    return user;
  }
  getToken(): string | null {
    const user = this.getUser();
    // recupération de token est stocké dans user.token
    return user ? user.token ?? null : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user?.role ?? null;
  }

  removeUser() {
    const user = this.getUser();
    if (user) {
      localStorage.removeItem(SESSION_KEY);
    }

    return true;
  }

  createUser(data: AuthenticatedUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));

    return true;
  }
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
