import { Routes } from '@angular/router';
import { AuthComponent } from '@features/auth/auth';
import { APP_ROUTES } from '@core/constants/routes.constants';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: APP_ROUTES.LOGIN,
                loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
            },
            {
                path: APP_ROUTES.FORGOT_PASSWORD,
                loadComponent: () =>
                    import('./forgot-password/forgot-password').then((m) => m.ForgotPasswordComponent),
            },
            {
                path: '',
                redirectTo: APP_ROUTES.LOGIN,
                pathMatch: 'full',
            },
        ],
    },
];
