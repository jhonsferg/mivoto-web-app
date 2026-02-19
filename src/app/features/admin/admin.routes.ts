import { Routes } from '@angular/router';
import { AdminComponent } from './admin';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'elections',
        loadComponent: () =>
          import('./elections-management/elections-management').then(
            (m) => m.ElectionsManagementComponent,
          ),
      },
      {
        path: 'candidates',
        loadComponent: () =>
          import('./candidates-management/candidates-management').then(
            (m) => m.CandidatesManagementComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users-management/users-management').then((m) => m.UsersManagementComponent),
      },
      {
        path: 'audit',
        loadComponent: () => import('./audit-logs/audit-logs').then((m) => m.AuditLogsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./user-settings/user-settings').then((m) => m.UserSettingsComponent),
      },
      {
        path: 'results/:id',
        loadComponent: () =>
          import('./election-results/election-results').then((m) => m.ElectionResultsComponent),
      },
    ],
  },
];
