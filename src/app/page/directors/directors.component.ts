import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { InputComponent, PersonsListComponent, PersonsTableComponent, ToolbarComponent } from '../../components';
import { View } from '../../enums';
import { Person, SearchConfig, SortOption } from '../../models';
import { DirectorService } from '../../services';
import { PersonUtils } from '../../utils';

@Component({
  selector: 'app-directors',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    InputComponent,
    MatPaginatorModule,
    PersonsListComponent,
    PersonsTableComponent,
    ToolbarComponent
  ],
  templateUrl: './directors.component.html',
  styleUrl: './directors.component.css'
})
export class DirectorsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  view = View;
  total: number;
  pageSizeOptions = [25, 50, 100];
  sortOptions = PersonUtils.sortOptions;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'name',
      direction: 'asc',
      term: '',
      view: View.CARDS
    }
  );

  directors$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.directorService.get(config.page, config.size, config.term, config.sort, config.direction).pipe(
        tap(response => this.total = +(response.headers.get('X-Total-Count') ?? 0)),
        map(response => (response.body ?? [])),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == View.TABLE // Concatène les nouvelles données
      ? result
      : acc.concat(result), []
    )
  );

  sorts$: Observable<SortOption[]> = this.searchConfig$.pipe(
    map(config =>
      this.sortOptions.map(option => (
        {
          ...option,
          direction: option.active === config.sort ? config.direction : '' // Met à jour la direction du tri
        })
      )
    )
  );

  constructor(public directorService: DirectorService) { }

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