import { AsyncPipe } from '@angular/common';
import { Component, effect, input, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { CriteriasReminderComponent, InputComponent, PersonsListComponent, PersonsTableComponent, ToolbarComponent } from '..';
import { EMPTY_STRING } from '../../app.component';
import { View } from '../../enums';
import { Country, Criterias, Person, SearchConfig, SortOption } from '../../models';
import { BaseService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-persons',
  imports: [
    AsyncPipe,
    CriteriasReminderComponent,
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
  cookieName = input<string>();

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

  constructor(private cookieService: CookieService) {
    effect(() => {
      this.searchConfig$.next(
        {
          page: 0,
          size: 50,
          sort: this.cookieService.get(this.cookieName()) ? (JSON.parse(this.cookieService.get(this.cookieName())) as SearchConfig).sort : 'name',
          direction: this.cookieService.get(this.cookieName()) ? (JSON.parse(this.cookieService.get(this.cookieName())) as SearchConfig).direction : 'asc',
          term: EMPTY_STRING,
          criterias: this.cookieService.get(this.cookieName()) ? (JSON.parse(this.cookieService.get(this.cookieName())) as SearchConfig).criterias : {},
          view: this.cookieService.get(this.cookieName()) ? (JSON.parse(this.cookieService.get(this.cookieName())) as SearchConfig).view : View.CARDS
        }
      )
    });
  }

  onDeleteCountry(country: Country) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.searchConfig$.value.criterias,
          countries: this.searchConfig$.value.criterias.countries.filter(c => c.id != country.id)
        }
      }
    );
    this.cookieService.set(this.cookieName(), JSON.stringify(this.searchConfig$.value), 7);
  }

  onFilter(event: Criterias) {
    this.updateSearchConfig({ page: 0, criterias: event });
    this.cookieService.set(this.cookieName(), JSON.stringify(this.searchConfig$.value), 7);
  }

  onSwitchView(view: View) {
    this.updateSearchConfig({ page: 0, view: view });
    this.cookieService.set(this.cookieName(), JSON.stringify(this.searchConfig$.value), 7);
  }

  onSort(event: SortOption) {
    if (this.searchConfig$.value.view == View.TABLE) {
      this.paginator.firstPage();
    }

    this.updateSearchConfig({ page: 0, sort: event.active, direction: event.direction });
    this.cookieService.set(this.cookieName(), JSON.stringify(this.searchConfig$.value), 7);
  }

  onSearch(event: string) {
    if (typeof event == 'string') {
      this.updateSearchConfig({ page: 0, term: event?.trim() });
    }
  }

  onScroll() {
    this.updateSearchConfig({ page: this.searchConfig$.value.page + 1 });
  }

  onPageChange(event: PageEvent) {
    this.updateSearchConfig({ page: event.pageIndex, size: event.pageSize });
  }

  private updateSearchConfig(newConfig: Partial<SearchConfig>) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        ...newConfig
      }
    );
  }
}
