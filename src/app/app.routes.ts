import { Routes } from '@angular/router';
import { ActorsComponent } from './page/actors/actors.component';
import { AddMovieComponent } from './page/add-movie/add-movie.component';
import { CountriesComponent } from './page/countries/countries.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { GenresComponent } from './page/genres/genres.component';
import { personTypeResolver } from './resolvers/person-type.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'add-movie',
    component: AddMovieComponent
  },
  {
    path: 'movies',
    loadComponent: () => import('./page/movies/movies.component').then(c => c.MoviesComponent)
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./page/movies/movie-detail/movie-detail.component').then(c => c.MovieDetailComponent)
  },
  {
    path: 'producers',
    loadComponent: () => import('./page/producers/producers.component').then(c => c.ProducersComponent)
  },
  {
    path: 'producers/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'directors',
    loadComponent: () => import('./page/directors/directors.component').then(c => c.DirectorsComponent)
  },
  {
    path: 'directors/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'screenwriters',
    loadComponent: () => import('./page/screenwriters/screenwriters.component').then(c => c.ScreenwritersComponent)
  },
  {
    path: 'screenwriters/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'musicians',
    loadComponent: () => import('./page/musicians/musicians.component').then(c => c.MusiciansComponent)
  },
  {
    path: 'musicians/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'decorators',
    loadComponent: () => import('./page/decorators/decorators.component').then(c => c.DecoratorsComponent)
  },
  {
    path: 'decorators/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'costumiers',
    loadComponent: () => import('./page/costumiers/costumiers.component').then(c => c.CostumiersComponent)
  },
  {
    path: 'costumiers/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'photographers',
    loadComponent: () => import('./page/photographers/photographers.component').then(c => c.PhotographersComponent)
  },
  {
    path: 'photographers/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'editors',
    loadComponent: () => import('./page/editors/editors.component').then(c => c.EditorsComponent)
  },
  {
    path: 'editors/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'casters',
    loadComponent: () => import('./page/casters/casters.component').then(c => c.CastersComponent)
  },
  {
    path: 'casters/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'art-directors',
    loadComponent: () => import('./page/art-directors/art-directors.component').then(c => c.ArtDirectorsComponent)
  },
  {
    path: 'art-directors/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'sound-editors',
    loadComponent: () => import('./page/sound-editors/sound-editors.component').then(c => c.SoundEditorsComponent)
  },
  {
    path: 'sound-editors/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'visual-effects-supervisors',
    loadComponent: () => import('./page/visual-effects-supervisors/visual-effects-supervisors.component').then(c => c.VisualEffectsSupervisorsComponent)
  },
  {
    path: 'visual-effects-supervisors/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'makeup-artists',
    loadComponent: () => import('./page/makeup-artists/makeup-artists.component').then(c => c.MakeupArtistsComponent)
  },
  {
    path: 'makeup-artists/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'hair-dressers',
    loadComponent: () => import('./page/hair-dressers/hair-dressers.component').then(c => c.HairDressersComponent)
  },
  {
    path: 'hair-dressers/:id',
    resolve: {
      person: personTypeResolver
    },
    loadComponent: () => import('./page/person-details/person-details.component').then(c => c.PersonDetailsComponent)
  },
  {
    path: 'actors',
    component: ActorsComponent
  },
  {
    path: 'genres',
    component: GenresComponent
  },
  {
    path: 'countries',
    component: CountriesComponent
  },
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
