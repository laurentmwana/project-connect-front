import { ProjectService } from '@/services/project.service';
import { UserLocalService } from '@/services/user-local.service';
import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const canEditGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserLocalService);
  const projectService = inject(ProjectService);
  const router = inject(Router);
  const location = inject(Location);

  const user = userService.getUser();
  const projectSlug = route.paramMap.get('slug');

  if (!user) {
    router.navigate(['/login']);
    return of(false);
  }

  if (!projectSlug) {
    location.back();
    return of(false);
  }

  // Recuperer le projet pour comparer l'auteur
  return projectService.getProjectBySlug(projectSlug).pipe(
    map((project) => {
      if (project.data.created_by.id === user.id) {
        return true;
      } else {
        location.back();
        return false;
      }
    }),
    catchError(() => {
      location.back();
      return of(false);
    })
  );
};
