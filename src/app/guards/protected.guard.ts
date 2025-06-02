import { UserLocalService } from '@/services/user-local.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const protectedGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserLocalService);
  const router = inject(Router);

  const user = userService.getUser();

  if (user === null) {
    router.navigate(['/login']);

    return false;
  }

  return true;
};
