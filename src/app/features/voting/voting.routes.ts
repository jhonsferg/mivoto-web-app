import { Routes } from '@angular/router';
import { VotingComponent } from './voting';

export const VOTING_ROUTES: Routes = [
  {
    path: '',
    component: VotingComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./elections-list/elections-list').then((m) => m.ElectionsListComponent),
      },
      {
        path: 'election/:id',
        loadComponent: () =>
          import('./election-detail/election-detail').then((m) => m.ElectionDetailComponent),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./vote-confirmation/vote-confirmation').then(
            (m) => m.VoteConfirmationComponent,
          ),
      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./vote-verification/vote-verification').then(
            (m) => m.VoteVerificationComponent,
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./voting-history/voting-history').then((m) => m.VotingHistoryComponent),
      },
    ],
  },
];
