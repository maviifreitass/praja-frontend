import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/users-list.component').then(m => m.UsersListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./details/user-details.component').then(m => m.UserDetailsComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./form/user-form.component').then(m => m.UserFormComponent)
  }
];
