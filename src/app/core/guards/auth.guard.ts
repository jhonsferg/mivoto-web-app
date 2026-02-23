import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { APP_ROUTES } from '../constants/routes.constants';
import { ROLES } from '../constants/roles.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (session.isAuthenticated()) {
    const role = session.userRole();
    if (role === ROLES.ADMIN) {
      return router.createUrlTree(['/', APP_ROUTES.ADMIN]);
    } else if (role === ROLES.VOTER) {
      return router.createUrlTree(['/', APP_ROUTES.VOTING]);
    } else if (role === ROLES.SUPERVISOR) {
      return router.createUrlTree(['/', APP_ROUTES.SUPERVISOR]);
    }
  }

  return true;
};
