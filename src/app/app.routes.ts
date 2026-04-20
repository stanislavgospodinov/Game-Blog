import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./features/posts/catalog/catalog.component').then(
        (m) => m.CatalogComponent,
      ),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./features/posts/details/details.component').then(
        (m) => m.DetailsComponent,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./features/create/create.component').then(
        (m) => m.CreateComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./features/posts/edit/edit.component').then(
        (m) => m.EditComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    canActivate: [guestGuard],
  },

  { path: '**', redirectTo: '/' },
];
