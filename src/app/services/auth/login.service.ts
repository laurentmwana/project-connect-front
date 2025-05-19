import { apiRoute } from '@/lib/route';
import { Authenticate, LoginUser } from '@/model/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  async authenticate(data: LoginUser) {
    return this.http.post<Authenticate>(apiRoute('login'), data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
  }
}
