import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { InputComponent, MoviesListComponent, MoviesTableComponent, ToolbarComponent } from '../../components';
import { View } from '../../enums';
import { Movie, SearchConfig, SortOption } from '../../models';
import { MovieService } from '../../services';

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
    { active: 'releaseDate', label: 'Date de sortie', direction: '' },
    { active: 'runningTime', label: 'Durée', direction: '' },
    { active: 'budget', label: 'Budget', direction: '' },
    { active: 'boxOffice', label: 'Box-office', direction: '' },
    { active: 'creationDate', label: 'Date de création', direction: '' },
    { active: 'lastUpdate', label: 'Dernière modification', direction: '' }
  ]

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'title',
      direction: 'asc',
      term: '',
      view: View.CARDS
    }
  );

  movies$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.movieService.getMovies(config.page, config.size, config.term, config.sort, config.direction).pipe(
        tap(response => this.total = +(response.headers.get('X-Total-Count') ?? 0)),
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
        direction: option.active === config.sort ? config.direction : '' // Met à jour la direction du tri
      }))
    )
  );

  constructor(private movieService: MovieService) { }

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
          term: event
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