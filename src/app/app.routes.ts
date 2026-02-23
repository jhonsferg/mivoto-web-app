import { Routes } from '@angular/router';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { authGuard } from '@core/guards/auth.guard';
import { sessionGuard } from '@core/guards/session.guard';
import { roleGuard } from '@core/guards/role.guard';
import { ROLES } from '@core/constants/roles.constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTES.AUTH,
    pathMatch: 'full',
  },
  {
    path: APP_ROUTES.AUTH,
    canActivate: [authGuard],
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: APP_ROUTES.VOTING,
    canActivate: [sessionGuard, roleGuard],
    data: { role: ROLES.VOTER },
    loadChildren: () => import('@features/voting/voting.routes').then((m) => m.VOTING_ROUTES),
  },
  {
    path: APP_ROUTES.ADMIN,
    canActivate: [sessionGuard, roleGuard],
    data: { role: ROLES.ADMIN },
    loadChildren: () => import('@features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: APP_ROUTES.SUPERVISOR,
    canActivate: [sessionGuard, roleGuard],
    data: { role: ROLES.SUPERVISOR },
    loadChildren: () => import('@features/supervisor/supervisor.routes').then((m) => m.SUPERVISOR_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
