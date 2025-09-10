import { Routes } from '@angular/router';

export const ticketsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/tickets-list.component').then(m => m.TicketsListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./form/ticket-form.component').then(m => m.TicketFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./details/ticket-details.component').then(m => m.TicketDetailsComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./form/ticket-form.component').then(m => m.TicketFormComponent)
  }
];
