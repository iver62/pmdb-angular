import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { CriteriasReminderComponent, InputComponent, PersonsListComponent, PersonsTableComponent, ToolbarComponent } from '../../components';
import { View } from '../../enums';
import { Country, Criterias, Person, SearchConfig, SortOption } from '../../models';
import { HttpUtils } from '../../utils';
import { PersonService } from '../../services/person.service';

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
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  countries$ = this.personService.getCountries;

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
      this.personService.getPersonsWithMoviesNumber(config.page, config.size, config.term, config.sort, config.direction, config.criterias).pipe(
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

  constructor(
    private cookieService: CookieService,
    private personService: PersonService
  ) {
    effect(() => {
      this.searchConfig$.next(
        {
          page: 0,
          size: 50,
          sort: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).sort : 'name',
          direction: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).direction : 'asc',
          term: EMPTY_STRING,
          criterias: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).criterias : {},
          view: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).view : View.CARDS
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
    this.cookieService.set('persons-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onFilter(event: Criterias) {
    this.updateSearchConfig({ page: 0, criterias: event });
    this.cookieService.set('persons-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onSwitchView(view: View) {
    this.updateSearchConfig({ page: 0, view: view });
    this.cookieService.set('persons-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onSort(event: SortOption) {
    if (this.searchConfig$.value.view == View.TABLE) {
      this.paginator.firstPage();
    }

    this.updateSearchConfig({ page: 0, sort: event.active, direction: event.direction });
    this.cookieService.set('persons-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onSearch(event: string) {
    if (typeof event == 'string') {
      if (this.searchConfig$.value.view == View.CARDS) {
        this.scrollContainer.nativeElement.scrollTo({ top: 0 });
      }
      this.paginator.firstPage();
      this.updateSearchConfig({ page: 0, term: event?.trim() });
    }
  }

  onScroll() {
    if (this.loaded < this.total) {
      this.updateSearchConfig({ page: this.searchConfig$.value.page + 1 });
    }
  }

  onPageChange(event: PageEvent) {
    this.tableContainer.nativeElement.scrollTo({ top: 0 });
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
