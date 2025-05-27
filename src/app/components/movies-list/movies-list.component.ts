import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Movie } from '../../models';
import { MovieCardComponent } from "./movie-card/movie-card.component";

@Component({
  selector: 'app-movies-list',
  imports: [
    MovieCardComponent,
    TranslatePipe
  ],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css'
})
export class MoviesListComponent {

  movies = input.required<Movie[]>();

}
