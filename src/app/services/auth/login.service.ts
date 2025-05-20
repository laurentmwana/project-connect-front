import { Authenticate, LoginUser } from '@/model/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  async authenticate(data: LoginUser) {
    const url = `${Environment.apiUrl}/login`

    return this.http.post<Authenticate>(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
  }
}
