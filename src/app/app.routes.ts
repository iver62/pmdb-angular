import { Routes } from '@angular/router';
import { ActorsComponent } from './page/actors/actors.component';
import { AddMovieComponent } from './page/add-movie/add-movie.component';
import { CostumiersComponent } from './page/costumiers/costumiers.component';
import { CountriesComponent } from './page/countries/countries.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { DecoratorsComponent } from './page/decorators/decorators.component';
import { DirectorsComponent } from './page/directors/directors.component';
import { EditorsComponent } from './page/editors/editors.component';
import { GenresComponent } from './page/genres/genres.component';
import { MusiciansComponent } from './page/musicians/musicians.component';
import { PhotographersComponent } from './page/photographers/photographers.component';
import { ProducersComponent } from './page/producers/producers.component';
import { ScreenwritersComponent } from './page/screenwriters/screenwriters.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-movie', component: AddMovieComponent },
  { path: 'movies', loadComponent: () => import('./page/movies/movies.component').then(c => c.MoviesComponent) },
  { path: 'movies/:id', loadComponent: () => import('./page/movies/movie-detail/movie-detail.component').then(c => c.MovieDetailComponent) },
  { path: 'producers', component: ProducersComponent },
  { path: 'directors', component: DirectorsComponent },
  { path: 'screenwriters', component: ScreenwritersComponent },
  { path: 'musicians', component: MusiciansComponent },
  { path: 'decorators', component: DecoratorsComponent },
  { path: 'costumiers', component: CostumiersComponent },
  { path: 'photographers', component: PhotographersComponent },
  { path: 'editors', component: EditorsComponent },
  { path: 'actors', component: ActorsComponent },
  { path: 'genres', component: GenresComponent },
  { path: 'countries', component: CountriesComponent },
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
