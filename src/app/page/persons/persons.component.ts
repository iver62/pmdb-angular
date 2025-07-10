import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, map, Observable, of, scan, startWith, Subject, switchMap, tap } from 'rxjs';
import { DURATION, EMPTY_STRING } from '../../app.component';
import { ConfirmationDialogComponent, CriteriasReminderComponent, PersonsListComponent, PersonsTableComponent, ToolbarComponent } from '../../components';
import { PersonType, View } from '../../enums';
import { Country, Criterias, Person, SearchConfig, SortOption, Type } from '../../models';
import { PersonService } from '../../services/person.service';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-persons',
  imports: [
    AsyncPipe,
    CriteriasReminderComponent,
    InfiniteScrollDirective,
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
    { active: 'awardsCount', label: 'app.number_of_awards', direction: EMPTY_STRING },
    { active: 'creationDate', label: 'app.creation_date', direction: EMPTY_STRING },
    { active: 'lastUpdate', label: 'app.last_update', direction: EMPTY_STRING }
  ];

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).sort : 'name',
      direction: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).direction : 'asc',
      term: EMPTY_STRING,
      criterias: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).criterias : { types: [{ id: 0, name: PersonType.ACTOR, display: () => PersonType.ACTOR }] },
      view: this.cookieService.get('persons-config') ? (JSON.parse(this.cookieService.get('persons-config')) as SearchConfig).view : View.GRID
    }
  );

  deletePerson$ = new Subject<Boolean>();

  persons$ = combineLatest([this.searchConfig$, this.deletePerson$.pipe(startWith(false))]).pipe(
    distinctUntilChanged(([c1, d1], [c2, d2]) => c1.page == c2.page && c1.size == c2.size && c1.sort == c2.sort && c1.direction == c2.direction && c1.term == c2.term && isEqual(c1.criterias, c2.criterias)),
    switchMap(([config, _]) =>
      this.personService.getPersonsWithMoviesNumber(config.page, config.size, config.term, config.sort, config.direction, config.criterias).pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => (response.body ?? [])),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) =>
      this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == View.TABLE
        ? result
        : acc.concat(result) // Concatène les nouvelles données
    ),
    tap(result => this.loaded = result.length)
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
    private dialog: MatDialog,
    private personService: PersonService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  onDeleteType(type: Type) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.searchConfig$.value.criterias,
          types: this.searchConfig$.value.criterias.types.filter(t => t.name != type.name)
        }
      }
    );
    this.cookieService.set('persons-config', JSON.stringify(this.searchConfig$.value), 7);
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
      if (this.searchConfig$.value.view == View.GRID) {
        this.scrollContainer.nativeElement.scrollTo({ top: 0 });
      }

      if (this.searchConfig$.value.view == View.TABLE) {
        this.paginator.firstPage();
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

  deletePerson(person: Person) {
    this.dialog.open(ConfirmationDialogComponent, {
      minWidth: '30vw',  // Définit la largeur à 30% de l'écran
      data: {
        title: this.translate.instant('app.confirm'),
        message: this.translate.instant('app.confirm_delete_message', { data: person.name })
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.personService.delete(person.id).subscribe(
          {
            next: () => {
              this.snackBar.open(this.translate.instant('app.delete_success_message', { data: person.name }), this.translate.instant('app.close'), { duration: DURATION });
              this.deletePerson$.next(true);
            },
            error: error => {
              console.error(error);
              this.snackBar.open(error.error, this.translate.instant('app.error'), { duration: DURATION });
            }
          }
        );
      }
    });
  }

}
