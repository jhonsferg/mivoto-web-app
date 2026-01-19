import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../constants/routes.constants';
import { map, catchError, of } from 'rxjs';

export const sessionGuard: CanActivateFn = (route, state) => {
    const session = inject(SessionService);
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!session.isAuthenticated()) {
        return router.createUrlTree(['/', APP_ROUTES.AUTH, APP_ROUTES.LOGIN]);
    }

    if (session.isTokenExpired()) {
        return session.renewToken().pipe(
            map(() => true),
            catchError(() => {
                auth.logout();
                return of(router.createUrlTree(['/', APP_ROUTES.AUTH, APP_ROUTES.LOGIN]));
            })
        );
    }

    return true;
};
