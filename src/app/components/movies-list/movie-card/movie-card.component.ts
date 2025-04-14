import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Movie } from '../../../models';
import { MovieService } from '../../../services';

@Component({
  selector: 'app-movie-card',
  imports: [
    AsyncPipe,
    DatePipe,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {

  movie = input.required<Movie>();

  posterUrl$: Observable<string>;

  constructor(private movieService: MovieService) {
    effect(() => this.posterUrl$ = this.movieService.getPosterUrl(this.movie().posterFileName));
  }
}
