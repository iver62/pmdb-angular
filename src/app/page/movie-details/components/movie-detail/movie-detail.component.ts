import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { Movie } from '../../../../models';
import { MovieService } from '../../../../services';

@Component({
  selector: 'app-movie-detail',
  imports: [
    DatePipe,
    NgPipesModule,
    RouterLink
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent {

  @Input() movie: Movie;

  constructor(
    private movieService: MovieService,
    private sanitizer: DomSanitizer
  ) { }

  getSafePosterUrl(posterFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.movieService.getPosterUrl(posterFileName));
  }

}
