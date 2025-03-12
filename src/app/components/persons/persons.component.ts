import { AsyncPipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { InputComponent, PersonsListComponent, PersonsTableComponent, ToolbarComponent } from '..';
import { EMPTY_STRING } from '../../app.component';
import { View } from '../../enums';
import { Criterias, Person, SearchConfig, SortOption } from '../../models';
import { BaseService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-persons',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    InputComponent,
    MatPaginatorModule,
    PersonsListComponent,
    PersonsTableComponent,
    ToolbarComponent
  ],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css'
})
export class PersonsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() personService!: BaseService; // Service injecté dynamiquement
  @Input() viewTitle = EMPTY_STRING; // Permet de personnaliser le titre

  view = View;
  total: number;
  pageSizeOptions = [25, 50, 100];
  sortOptions: SortOption[] = [
    { active: 'name', label: 'Nom', direction: 'asc' },
    { active: 'dateOfBirth', label: 'Date de naissance', direction: EMPTY_STRING },
    { active: 'dateOfDeath', label: 'Date de décès', direction: EMPTY_STRING },
    { active: 'creationDate', label: 'Date de création', direction: EMPTY_STRING },
    { active: 'lastUpdate', label: 'Dernière modification', direction: EMPTY_STRING }
  ];

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'name',
      direction: 'asc',
      term: EMPTY_STRING,
      criterias: {},
      view: View.CARDS
    }
  );

  persons$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.personService.get(config.page, config.size, config.term, config.sort, config.direction, config.criterias).pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
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
          direction: option.active === config.sort ? config.direction : EMPTY_STRING // Met à jour la direction du tri
        })
      )
    )
  );

  onFilter(event: Criterias) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        criterias: event
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
