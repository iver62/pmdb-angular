import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Movie, MovieWithPoster } from '../../models';
import { MovieService } from '../../services';

@Component({
  selector: 'app-movies-table',
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    MatSortModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './movies-table.component.html',
  styleUrl: './movies-table.component.css'
})
export class MoviesTableComponent {

  dataSource = input.required<Movie[]>();
  enrichedMovies = signal<MovieWithPoster[]>([]);

  @Input() sortActive: string;
  @Input() sortDirection: SortDirection;

  @Output() sort = new EventEmitter<{ active: string, direction: 'asc' | 'desc' }>();

  env = environment;
  displayedColumns = ['title', 'originalTitle', 'releaseDate', 'runningTime', 'budget', 'boxOffice', 'user', 'numberOfAwards', 'creationDate', 'lastUpdate'];

  constructor(private movieService: MovieService) {
    // Transformer les films en ajoutant les URLs
    effect(() => {
      const movies = this.dataSource().map(m => (
        {
          ...m,
          posterUrl$: this.movieService.getPosterUrl(m.posterFileName) // Observable pour l'affiche
        }
      ));
      this.enrichedMovies.set(movies);
    });
  }

  onSort(event: any) {
    this.sort.emit(event);
  }
}