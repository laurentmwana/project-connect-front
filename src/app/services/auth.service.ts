import {
  AuthenticatedUser,
  ForgotPasswordResponse,
  LoginCredentials,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/model/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async authenticate(data: LoginCredentials) {
    const url = `${Environment.apiUrl}/login`;

    return this.http.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async forgotPassword(email: string) {
    const url = `${Environment.apiUrl}/forgot-password`;

    return this.http.post(
      url,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
  }

  async passwordReset(data: ResetPasswordRequest) {
    const url = `${Environment.apiUrl}/reset-password`;

    return this.http.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async register(data: RegisterRequest) {
    const url = `${Environment.apiUrl}/register`;

    return this.http.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async verifyEmail(userId: number, hashToken: string, token?: string) {
    const url = `${Environment.apiUrl}/verify-email/${userId}/${hashToken}?token=${token}`;

    return this.http.post(url, null, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
