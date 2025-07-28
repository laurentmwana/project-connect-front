import { PaginatedUsers, User } from '@/model/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLocalService } from './user-local.service';
import { Environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  url = `${Environment.apiUrl}/`;

  constructor(
    private http: HttpClient,
    private userLocalService: UserLocalService
  ) {}

  getAllUsers(
    page: number = 1,
    filtesr: {
      email?: string;
      name?: string;
      state?: number;
      per_page?: number;
    } = {}
  ): Observable<PaginatedUsers> {
    let params = new HttpParams().set('page', page.toString());
    if (filtesr?.email) {
      params = params.append('email', filtesr.email);
    }
    if (filtesr?.name) {
      params = params.append('name', filtesr.name);
    }
    if (filtesr?.state) {
      params = params.append('state', filtesr.state.toString());
    }
    if (filtesr?.per_page) {
      params = params.append('per_page', filtesr.per_page.toString());
    }
    const user = this.userLocalService.getUser();

    return this.http.get<PaginatedUsers>(`${this.url}users?page=${page}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      params,
    });
  }

  toggleUser(id: number) {
    const user = this.userLocalService.getUser();

    return this.http.post(
      `${this.url}users/${id}/state`,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
  }

  destroyProject(id:number){
    const user = this.userLocalService.getUser();

    return this.http.post(
      `${this.url}projects/destroy/${id}`,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

  }
}
