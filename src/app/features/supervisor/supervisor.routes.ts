import { Routes } from '@angular/router';
import { SupervisorComponent } from './supervisor';

export const SUPERVISOR_ROUTES: Routes = [
  {
    path: '',
    component: SupervisorComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./elections/supervisor-elections').then((m) => m.SupervisorElectionsComponent),
      },
      {
        path: 'results/:id',
        loadComponent: () =>
          import('../admin/election-results/election-results').then((m) => m.ElectionResultsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../admin/user-settings/user-settings').then((m) => m.UserSettingsComponent),
      },
    ],
  },
];
