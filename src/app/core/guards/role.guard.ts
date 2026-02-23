import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { ROLES } from '../constants/roles.constants';
import { APP_ROUTES } from '../constants/routes.constants';

export const roleGuard: CanActivateFn = (route, state) => {
    const session = inject(SessionService);
    const router = inject(Router);

    const expectedRole = route.data['role'];
    const currentRole = session.userRole();

    if (currentRole === expectedRole) {
        return true;
    }

    // Redirect based on actual role
    if (currentRole === ROLES.ADMIN) {
        return router.createUrlTree(['/', APP_ROUTES.ADMIN]);
    } else if (currentRole === ROLES.VOTER) {
        return router.createUrlTree(['/', APP_ROUTES.VOTING]);
    } else if (currentRole === ROLES.SUPERVISOR) {
        return router.createUrlTree(['/', APP_ROUTES.SUPERVISOR]);
    }

    // Fallback (e.g. if no role or invalid)
    return router.createUrlTree(['/', APP_ROUTES.AUTH, APP_ROUTES.LOGIN]);
};
