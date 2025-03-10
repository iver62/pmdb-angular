import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, combineLatest, map, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { InputComponent, MoviesListComponent } from '../../components';
import { Movie, SearchConfig } from '../../models';
import { GenreService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-genre-details',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MoviesListComponent,
    RouterLink
  ],
  templateUrl: './genre-details.component.html',
  styleUrl: './genre-details.component.css'
})
export class GenreDetailsComponent {

  total: number;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      sort: 'title',
      direction: 'asc',
      term: EMPTY_STRING
    }
  );

  movies$ = combineLatest([this.route.paramMap, this.searchConfig$]).pipe(
    switchMap(([params, config]) =>
      this.genreService.getMovies(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response =>
          (response.body ?? []).map(m => (
            {
              id: m.id,
              title: m.title,
              releaseDate: m.releaseDate,
              posterFileName: m.posterFileName
            }
          ))
        ),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Movie[], result: Movie[]) => this.searchConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouvelles données
  );
  genreName = this.router.getCurrentNavigation().extras.state['name'];

  constructor(
    private genreService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  onSearch(event: string) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        term: event
      }
    );
  }

  onScroll() {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: this.searchConfig$.value.page + 1
      }
    );
  }
}
