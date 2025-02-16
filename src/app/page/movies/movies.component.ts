import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { MoviesListComponent } from '../../components';
import { DelayedInputDirective } from '../../directives';
import { Movie, SearchConfig } from '../../models';
import { MovieService } from '../../services';

@Component({
  selector: 'app-movies',
  imports: [
    AsyncPipe,
    DatePipe,
    DelayedInputDirective,
    FormsModule,
    InfiniteScrollDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MoviesListComponent
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {

  view: 'table' | 'cards' = 'cards';
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

  movies$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.movieService.getPaginatedMovies(config.page, config.size, config.term).pipe(
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
  );

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  displayedColumns = ['title', 'originalTitle', 'releaseDate', 'runningTime', 'budget', 'boxOffice'];
  data: Movie[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private movieService: MovieService) { }

  // ngAfterViewInit() {
  //   // If the user changes the sort order, reset back to the first page.
  //   this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

  //   merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         return this.movieService!.getAll().pipe(catchError(() => of(null)));
  //       }),
  //       map(data => {
  //         // Flip flag to show that loading has finished.
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = data === null;

  //         if (data === null) {
  //           return [];
  //         }

  //         // Only refresh the result length if there is new data. In case of rate
  //         // limit errors, we do not want to reset the paginator to zero, as that
  //         // would prevent users from re-triggering requests.
  //         // this.resultsLength = data.total_count;
  //         return data;
  //       }),
  //     )
  //     .subscribe(data => (this.data = data));
  // }

  switchView(view: 'table' | 'cards') {
    this.view = view;
  }

  // Effacer la recherche
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
