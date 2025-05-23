import {
  Authenticate,
  ForgotPasswordUser,
  LoginUser,
  PasswordResetData,
  PasswordResetUser,
  RegisterData,
} from '@/model/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async authenticate(data: LoginUser) {
    const url = `${Environment.apiUrl}/login`;

    return this.http.post<Authenticate>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async forgotPassword(email: string) {
    const url = `${Environment.apiUrl}/forgot-password`;

    return this.http.post<ForgotPasswordUser>(
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

  async passwordReset(data: PasswordResetData) {
    const url = `${Environment.apiUrl}/reset-password`;

    return this.http.post<PasswordResetUser>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async register(data: RegisterData) {
    const url = `${Environment.apiUrl}/register`;

    return this.http.post<PasswordResetUser>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }
  
}
