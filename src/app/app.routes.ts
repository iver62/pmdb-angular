import { Routes } from '@angular/router';
import { EMPTY_STRING } from './app.component';
import { authGuard } from './guards';
import { personServiceResolver } from './resolvers';

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
    path: 'actors',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/actors/actors.component').then(c => c.ActorsComponent)
  },
  {
    path: 'actors/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'producers',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/producers/producers.component').then(c => c.ProducersComponent)
  },
  {
    path: 'producers/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'directors',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/directors/directors.component').then(c => c.DirectorsComponent)
  },
  {
    path: 'directors/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'screenwriters',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/screenwriters/screenwriters.component').then(c => c.ScreenwritersComponent)
  },
  {
    path: 'screenwriters/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'musicians',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/musicians/musicians.component').then(c => c.MusiciansComponent)
  },
  {
    path: 'musicians/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'decorators',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/decorators/decorators.component').then(c => c.DecoratorsComponent)
  },
  {
    path: 'decorators/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'costumiers',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/costumiers/costumiers.component').then(c => c.CostumiersComponent)
  },
  {
    path: 'costumiers/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'photographers',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/photographers/photographers.component').then(c => c.PhotographersComponent)
  },
  {
    path: 'photographers/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'editors',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/editors/editors.component').then(c => c.EditorsComponent)
  },
  {
    path: 'editors/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'casters',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/casters/casters.component').then(c => c.CastersComponent)
  },
  {
    path: 'casters/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'art-directors',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/art-directors/art-directors.component').then(c => c.ArtDirectorsComponent)
  },
  {
    path: 'art-directors/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'sound-editors',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/sound-editors/sound-editors.component').then(c => c.SoundEditorsComponent)
  },
  {
    path: 'sound-editors/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'visual-effects-supervisors',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/visual-effects-supervisors/visual-effects-supervisors.component').then(c => c.VisualEffectsSupervisorsComponent)
  },
  {
    path: 'visual-effects-supervisors/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'makeup-artists',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/makeup-artists/makeup-artists.component').then(c => c.MakeupArtistsComponent)
  },
  {
    path: 'makeup-artists/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'hair-dressers',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/hair-dressers/hair-dressers.component').then(c => c.HairDressersComponent)
  },
  {
    path: 'hair-dressers/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'stuntmen',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    loadComponent: () => import('./page/stuntmen/stuntmen.component').then(c => c.StuntmenComponent)
  },
  {
    path: 'stuntmen/:id',
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] },
    resolve: {
      service: personServiceResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  // {
  //   path: 'genres',
  // canActivate: [authGuard],
  //   loadComponent: () => import('./page/genres/genres.component').then(c => c.GenresComponent)
  // },
  // {
  //   path: 'genres/:id',
  // canActivate: [authGuard],
  //   loadComponent: () => import('./page/genre-details/genre-details.component').then(c => c.GenreDetailsComponent)
  // },
  // {
  //   path: 'countries',
  // canActivate: [authGuard],
  //   loadComponent: () => import('./page/countries/countries.component').then(c => c.CountriesComponent)
  // },
  // {
  //   path: 'countries/:id',
  // canActivate: [authGuard],
  //   loadComponent: () => import('./page/country-details/country-details.component').then(c => c.CountryDetailsComponent)
  // },
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
