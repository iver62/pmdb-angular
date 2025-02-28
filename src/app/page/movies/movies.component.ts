import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { InputComponent, MoviesListComponent } from '../../components';
import { Movie, SearchConfig, Sort } from '../../models';
import { MovieService } from '../../services';

@Component({
  selector: 'app-movies',
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    InfiniteScrollDirective,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MoviesListComponent,
    RouterLink
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {

  total: number;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'title',
      direction: 'Ascending',
      term: '',
      view: 'cards'
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
    scan((acc: Movie[], result: Movie[]) => this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == 'table' // Concatène les nouvelles données
      ? result
      : acc.concat(result), []
    )
  );

  sorts: Sort[] = [
    {
      active: 'title',
      label: 'Titre',
      direction: 'asc'
    },
    {
      active: 'releaseDate',
      label: 'Date de sortie',
      direction: ''
    },
    {
      active: 'runningTime',
      label: 'Durée',
      direction: ''
    },
    {
      active: 'budget',
      label: 'Budget',
      direction: ''
    },
    {
      active: 'boxOffice',
      label: 'Box-office',
      direction: ''
    },
    {
      active: 'creationDate',
      label: 'Date de création',
      direction: ''
    },
    {
      active: 'lastUpdate',
      label: 'Dernière modification',
      direction: ''
    }
  ]

  isLoadingResults = true;
  isRateLimitReached = false;

  displayedColumns = ['poster', 'title', 'originalTitle', 'releaseDate', 'runningTime', 'budget', 'boxOffice', 'creationDate', 'lastUpdate'];
  // columns: Column[] = [
  //   {
  //     columnDef: 'poster',
  //     columnLabel: 'Affiche',
  //     columnValue: (movie: Movie) => movie.posterFileName
  //   },
  //   {
  //     columnDef: 'title',
  //     columnLabel: 'Titre',
  //     columnValue: (movie: Movie) => movie.title
  //   },
  //   {
  //     columnDef: 'originalTitle',
  //     columnLabel: 'Titre original',
  //     columnValue: (movie: Movie) => movie.originalTitle
  //   },
  //   {
  //     columnDef: 'synopsis',
  //     columnLabel: 'Synopsis',
  //     columnValue: (movie: Movie) => movie.synopsis
  //   },
  //   {
  //     columnDef: 'releaseDate',
  //     columnLabel: 'Date de sortie',
  //     columnValue: (movie: Movie) => movie.releaseDate
  //   },
  //   {
  //     columnDef: 'runningTime',
  //     columnLabel: 'Durée',
  //     columnValue: (movie: Movie) => movie.runningTime
  //   },
  //   {
  //     columnDef: 'budget',
  //     columnLabel: 'Budget',
  //     columnValue: (movie: Movie) => movie.budget
  //   },
  //   {
  //     columnDef: 'boxOffice',
  //     columnLabel: 'Box-office',
  //     columnValue: (movie: Movie) => movie.boxOffice
  //   }
  // ];

  constructor(
    private movieService: MovieService,
    private sanitizer: DomSanitizer
  ) { }

  getSafePosterUrl(posterFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.movieService.getPosterUrl(posterFileName));
  }

  getSortActive() {
    return this.searchConfig$.value.sort;
  }

  getSortDirection() {
    return this.searchConfig$.value.direction == 'Ascending' ? 'asc' : 'desc';
  }

  switchView(view: 'table' | 'cards') {
    this.pageSize = this.searchConfig$.value.size;
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        view: view
      }
    );
  }

  onSortChange(selectedSort: Sort) {
    this.sorts.forEach(sort => {
      if (sort.active !== selectedSort.active) {
        sort.direction = ''; // Réinitialise les autres directions
      }
    });
    selectedSort.direction = selectedSort.direction === 'asc' ? 'desc' : 'asc'; // Alterne entre 'asc' et 'desc'

    this.onSort(selectedSort); // Déclenche l'événement de tri
  }

  onSort(event: any) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        sort: event.active,
        direction: event.direction == 'asc' ? 'Ascending' : 'Descending'
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

  onPageChange(event: any) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: event.pageIndex,
        size: event.pageSize
      }
    );
  }
}