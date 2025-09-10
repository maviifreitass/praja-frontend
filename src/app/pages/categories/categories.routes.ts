import { Routes } from '@angular/router';

export const categoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/categories-list.component').then(m => m.CategoriesListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./form/category-form.component').then(m => m.CategoryFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./details/category-details.component').then(m => m.CategoryDetailsComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./form/category-form.component').then(m => m.CategoryFormComponent)
  }
];
