import { Injectable } from '@angular/core';
import { UserLocalService } from './user-local.service';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Environment } from 'environments/environment';
import { PaginatedCandidacies } from '@/model/candidacy';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidacyService {
  constructor(
    private userLocalService: UserLocalService,
    private http: HttpClient
  ) {}

  applyForRole(id: number) {
    const url = `${Environment.apiUrl}/`;
    const user = this.userLocalService.getUser();
    console.log(user);

    return this.http.post(
      url + `project-roles/${id}/apply`,
      {},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
  }

  getCandidacies(
    projectId: number,
    filters?: {
      roleName?: string;
      userName?: string;
      isValidated?: boolean;
      page?: number;
      perPage?: number;
    }
  ): Observable<PaginatedCandidacies> {
    let params = new HttpParams();
    const url = `${Environment.apiUrl}/projects/${projectId}/candidacies`;
    const user = this.userLocalService.getUser();
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    };

    if (filters?.roleName) {
      params = params.append('role_name', filters.roleName);
    }

    if (filters?.userName) {
      params = params.append('user_name', filters.userName);
    }

    if (filters?.isValidated !== undefined) {
      const isValidatedNumber = filters.isValidated ? 1 : 0;
      params = params.append('is_validated', isValidatedNumber.toString());
    }

    if (filters?.page) {
      params = params.append('page', filters.page.toString());
    }

    if (filters?.perPage) {
      params = params.append('per_page', filters.perPage.toString());
    }

    return this.http.get<PaginatedCandidacies>(url, { headers, params });
  }
}
