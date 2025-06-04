import { Injectable } from '@angular/core';
import { UserLocalService } from './user-local.service';
import { HttpClient } from '@angular/common/http';

import { Environment } from 'environments/environment';

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

    return this.http.post(url + `project-roles/${id}/apply`,{}, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
  }
}
