import { Routes } from '@angular/router';
import { EMPTY_STRING } from './app.component';
import { authGuard } from './guards';

export const routes: Routes = [
  {
    path: EMPTY_STRING,
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'add-movie',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/add-movie/add-movie.component').then(c => c.AddMovieComponent)
  },
  {
    path: 'movies',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/movies/movies.component').then(c => c.MoviesComponent)
  },
  {
    path: 'movies/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/movie-details/movie-details.component').then(c => c.MovieDetailsComponent)
  },
  {
    path: 'persons',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/persons/persons.component').then(c => c.PersonsComponent)
  },
  {
    path: 'persons/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'user',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/user/user.component').then(c => c.UserComponent)
  },
  {
    path: 'users',
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./page/users/users.component').then(c => c.UsersComponent)
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./page/forbidden/forbidden.component').then(c => c.ForbiddenComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./page/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
