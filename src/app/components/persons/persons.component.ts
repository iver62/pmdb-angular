import { AsyncPipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { View } from '../../enums';
import { Person, SearchConfig, SortOption } from '../../models';
import { BaseService } from '../../services';
import { InputComponent } from '../input/input.component';
import { PersonsListComponent } from '../persons-list/persons-list.component';
import { PersonsTableComponent } from '../persons-table/persons-table.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

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
  @Input() viewTitle: string = ''; // Permet de personnaliser le titre

  view = View;
  total: number;
  pageSizeOptions = [25, 50, 100];
  sortOptions: SortOption[] = [
    { active: 'name', label: 'Nom', direction: 'asc' },
    { active: 'dateOfBirth', label: 'Date de naissance', direction: '' },
    { active: 'dateOfDeath', label: 'Date de décès', direction: '' },
    { active: 'creationDate', label: 'Date de création', direction: '' },
    { active: 'lastUpdate', label: 'Dernière modification', direction: '' }
  ];

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

  persons$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.personService.get(config.page, config.size, config.term, config.sort, config.direction).pipe(
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
