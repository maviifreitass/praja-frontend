import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tickets',
    pathMatch: 'full'
  },
  {
    path: 'tickets',
    loadChildren: () => import('./pages/tickets/tickets.routes').then(m => m.ticketsRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes),
    canActivate: [PublicGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.routes').then(m => m.categoriesRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.routes').then(m => m.usersRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/tickets'
  }
];
