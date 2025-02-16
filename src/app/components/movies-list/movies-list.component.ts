import { Component, input } from '@angular/core';
import { Movie } from '../../models';
import { MovieCardComponent } from "./movie-card/movie-card.component";

@Component({
  selector: 'app-movies-list',
  imports: [MovieCardComponent],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css'
})
export class MoviesListComponent {

  movies = input.required<Movie[]>();

}
