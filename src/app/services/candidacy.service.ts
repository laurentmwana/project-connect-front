import { Injectable } from '@angular/core';
import { UserLocalService } from './user-local.service';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Environment } from 'environments/environment';
import { CandidacyResponse } from '@/model/candidacy';

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
    filters: {
      role_name?: string;
      user_name?: string;
      is_validated?: number;
      per_page?: number;
      page?: number;
    } = {}
  ) {
    const user = this.userLocalService.getUser();
    const url = `${Environment.apiUrl}/projects/${projectId}/candidacies`;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    };

    const params = new HttpParams({
      fromObject: filters as Record<string, string>,
    });

    return this.http.get<CandidacyResponse>(url, { headers, params });
  }
}
