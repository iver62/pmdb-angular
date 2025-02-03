import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../models';
import { MovieService } from '../../../services';

@Component({
  selector: 'app-movie-card',
  imports: [
    DatePipe,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {

  movie = input.required<Movie>();

  constructor(
    private movieService: MovieService,
    private sanitizer: DomSanitizer
  ) { }

  getSafePosterUrl(posterFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.movieService.getPosterUrl(posterFileName));
  }
}
