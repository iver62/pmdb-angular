import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { InputComponent, MoviesListComponent, MoviesTableComponent, ToolbarComponent } from '../../components';
import { View } from '../../enums';
import { Movie, SearchConfig, SortOption } from '../../models';
import { Filters } from '../../models/filters.model';
import { MovieService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-movies',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    InputComponent,
    MatPaginatorModule,
    MoviesListComponent,
    MoviesTableComponent,
    ToolbarComponent
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  view = View;
  total: number;
  pageSizeOptions = [25, 50, 100];
  sortOptions: SortOption[] = [
    { active: 'title', label: 'Titre', direction: 'asc' },
    { active: 'releaseDate', label: 'Date de sortie', direction: EMPTY_STRING },
    { active: 'runningTime', label: 'Durée', direction: EMPTY_STRING },
    { active: 'budget', label: 'Budget', direction: EMPTY_STRING },
    { active: 'boxOffice', label: 'Box-office', direction: EMPTY_STRING },
    { active: 'creationDate', label: 'Date de création', direction: EMPTY_STRING },
    { active: 'lastUpdate', label: 'Dernière modification', direction: EMPTY_STRING }
  ];

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'title',
      direction: 'asc',
      term: EMPTY_STRING,
      filters: {},
      view: View.CARDS
    }
  );

  movies$ = this.searchConfig$.pipe(
    distinctUntilChanged((c1, c2) => c1.page == c2.page && c1.size == c2.size && c1.sort == c2.sort && c1.direction == c2.direction && c1.term == c2.term && c1.filters === c2.filters),
    switchMap(config =>
      this.movieService.getMovies(config.page, config.size, config.term, config.sort, config.direction, config.filters).pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => (response.body ?? [])),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Movie[], result: Movie[]) => this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == View.TABLE // Concatène les nouvelles données
      ? result
      : acc.concat(result), []
    )
  );

  sorts$: Observable<SortOption[]> = this.searchConfig$.pipe(
    map(config =>
      this.sortOptions.map(option => ({
        ...option,
        direction: option.active === config.sort ? config.direction : EMPTY_STRING // Met à jour la direction du tri
      }))
    )
  );

  constructor(private movieService: MovieService) { }

  onFilter(event: Filters) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        filters: event
      }
    );
  }

  onSwitchView(view: View) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        view: view
      }
    );
  }

  onSort(event: SortOption) {
    if (this.searchConfig$.value.view == View.TABLE) {
      this.paginator.firstPage();
    }

    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        sort: event.active,
        direction: event.direction
      }
    );
  }

  onSearch(event: string) {
    if (typeof event === 'string') {
      this.searchConfig$.next(
        {
          ...this.searchConfig$.value,
          page: 0,
          term: event.trim()
        }
      );
    }
  }

  onScroll() {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: this.searchConfig$.value.page + 1
      }
    );
  }

  onPageChange(event: PageEvent) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: event.pageIndex,
        size: event.pageSize
      }
    );
  }
}