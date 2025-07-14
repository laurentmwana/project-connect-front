import { UserLocalService } from '@/services/user-local.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserLocalService);
  const router = inject(Router);

  const role = userService.getRole();

  if (role !== 'admin') {
    router.navigate(['/login']);

    return false;
  }

  return true;
};
