import { AsyncPipe, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { Observable } from 'rxjs';
import { Movie } from '../../../../models';
import { MovieService } from '../../../../services';

@Component({
  selector: 'app-movie-detail',
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    MatIconModule,
    NgPipesModule,
    TranslatePipe,
    UpperCasePipe
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent {

  movie = input.required<Movie>();

  posterUrl$: Observable<string>;

  constructor(movieService: MovieService) {
    effect(() => this.posterUrl$ = movieService.getPosterUrl(this.movie()?.posterFileName));
  }

}
