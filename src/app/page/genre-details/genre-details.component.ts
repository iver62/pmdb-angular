import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { MoviesListComponent } from '../../components';
import { Movie, SearchConfig } from '../../models';
import { GenreService } from '../../services';

@Component({
  selector: 'app-genre-details',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
      direction: 'Ascending',
      term: ''
    }
  );

  movies$ = this.route.paramMap.pipe(
    switchMap(params =>
      this.searchConfig$.pipe(
        switchMap(config =>
          this.genreService.getMovies(+params.get('id'), config.page, config.size, config.term).pipe(
            tap(response => this.total = +(response.headers.get('X-Total-Count') ?? 0)),
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
      )
    )
  );
  name = this.router.getCurrentNavigation().extras.state['name'];

  constructor(
    private genreService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  clearSearch() {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        term: ''
      }
    );
  }

  onSearch(event: Event) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        term: (event.target as HTMLInputElement).value
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
