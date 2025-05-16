import { AsyncPipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, effect, ElementRef, input, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
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
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css'
})
export class PersonsComponent {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() personService!: BaseService; // Service injecté dynamiquement
  @Input() viewTitle = EMPTY_STRING; // Permet de personnaliser le titre
  countries$ = input.required<(term: string) => Observable<HttpResponse<Country[]>>>();
  cookieName = input<string>();

  view = View;
  total: number;
  private loaded = 0;
  pageSizeOptions = [25, 50, 100];
  sortOptions: SortOption[] = [
    { active: 'name', label: 'app.name', direction: 'asc' },
    { active: 'dateOfBirth', label: 'app.birth_date', direction: EMPTY_STRING },
    { active: 'dateOfDeath', label: 'app.death_date', direction: EMPTY_STRING },
    { active: 'moviesCount', label: 'app.number_of_movies', direction: EMPTY_STRING },
    { active: 'creationDate', label: 'app.creation_date', direction: EMPTY_STRING },
    { active: 'lastUpdate', label: 'app.last_update', direction: EMPTY_STRING }
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
    scan((acc: Person[], result: Person[]) => {
      if (this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == View.TABLE) {
        this.loaded = result.length;
        return result;
      } else { // Concatène les nouvelles données
        const newArray = acc.concat(result);
        this.loaded = newArray.length;
        return newArray;
      }
    })
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
      if (this.searchConfig$.value.view == View.CARDS) {
        this.scrollContainer.nativeElement.scrollTo({ top: 0 });
      }
      this.updateSearchConfig({ page: 0, term: event?.trim() });
    }
  }

  onScroll() {
    if (this.loaded < this.total) {
      this.updateSearchConfig({ page: this.searchConfig$.value.page + 1 });
    }
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
