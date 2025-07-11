import { AsyncPipe } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgPipesModule } from 'ngx-pipes';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { DURATION, EMPTY_STRING } from '../../app.component';
import { ConfirmationDialogComponent, MoviesListComponent, MoviesTableComponent, ToolbarComponent } from '../../components';
import { CriteriasReminderComponent } from "../../components/criterias-reminder/criterias-reminder.component";
import { PersonType, View } from '../../enums';
import { Category, Country, Criterias, Movie, Person, SearchConfig, SortOption, User } from '../../models';
import { MovieService, PersonService } from '../../services';
import { HttpUtils } from '../../utils';
import { PersonDetailComponent, PersonFormComponent } from './components';
import { RolesTableComponent } from "./components/roles-table/roles-table.component";

@Component({
  selector: 'app-person-details',
  imports: [
    AsyncPipe,
    CriteriasReminderComponent,
    InfiniteScrollDirective,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MoviesListComponent,
    MoviesTableComponent,
    NgPipesModule,
    PersonDetailComponent,
    PersonFormComponent,
    RolesTableComponent,
    RouterLink,
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.scss'
})
export class PersonDetailsComponent {

  @ViewChild(MatPaginator) moviesPaginator!: MatPaginator;
  @ViewChild(MatPaginator) rolesPaginator!: MatPaginator;

  private selectedTab$ = new BehaviorSubject<number>(0);

  moviesSearchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 25,
      sort: 'title',
      direction: 'asc',
      term: EMPTY_STRING,
      criterias: {},
      view: View.GRID
    }
  );

  rolesSearchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 25,
      sort: 'movie.title',
      direction: 'asc'
    }
  );

  sorts$: Observable<SortOption[]> = this.moviesSearchConfig$.pipe(
    map(config =>
      this.sortOptions.map(option => (
        {
          ...option,
          direction: option.active === config.sort ? config.direction : EMPTY_STRING // Met à jour la direction du tri
        }
      ))
    )
  );

  movies$ = combineLatest([this.moviesSearchConfig$, this.selectedTab$]).pipe(
    filter(([_, tab]) => !!this.person() && tab == 0),
    switchMap(([config, _]) =>
      this.personService.getMoviesByPerson(this.person().id, config.page, config.size, config.term, config.sort, config.direction, config.criterias).pipe(
        tap(response => this.totalMovies = +response.headers.get(HttpUtils.X_TOTAL_COUNT)),
        map(response => response.body ?? []),
        catchError(error => {
          console.error('Erreur lors de la récupération des films:', error);
          return of(null); // Retourne un observable avec null en cas d'erreur
        })
      )
    ),
    scan((acc: Movie[], result: Movie[]) => this.moviesSearchConfig$.value.page == 0 || this.moviesSearchConfig$.value.view == View.TABLE // Concatène les nouvelles données
      ? result
      : acc.concat(result), []
    )
  );

  groupedCeremonies$ = this.selectedTab$.pipe(
    filter(tab => !!this.person() && tab == 1),
    switchMap(() =>
      this.personService.getAwardsByPerson(this.person().id).pipe(
        tap(result => this.totalAwards = result?.map(r => r.movieAwards?.flatMap(ma => ma.awards).length)?.reduce((acc, currentValue) => acc + currentValue)),
        catchError(error => {
          console.error('Erreur lors de la récupération des récompenses:', error);
          return of(null); // Retourne un observable avec null en cas d'erreur
        })
      )
    )
  );

  roles$ = combineLatest([this.rolesSearchConfig$, this.selectedTab$]).pipe(
    filter(([_, tab]) => !!this.person() && tab == 2),
    switchMap(([config, _]) =>
      this.personService.getRolesByPerson(this.person().id, config.page, config.size, config.sort, config.direction).pipe(
        tap(response => this.totalRoles = +response.headers.get(HttpUtils.X_TOTAL_COUNT)),
        map(response => response.body ?? []),
        catchError(error => {
          console.error('Erreur lors de la récupération des rôles:', error);
          return of(null); // Retourne un observable avec null en cas d'erreur
        })
      )
    )
  );

  sortOptions: SortOption[] = [
    { active: 'title', label: 'app.title', direction: 'asc' },
    { active: 'originalTitle', label: 'app.original_title', direction: EMPTY_STRING },
    { active: 'releaseDate', label: 'app.release_date', direction: EMPTY_STRING },
    { active: 'runningTime', label: 'app.duration', direction: EMPTY_STRING },
    { active: 'budget', label: 'app.budget', direction: EMPTY_STRING },
    { active: 'boxOffice', label: 'app.box_office', direction: EMPTY_STRING },
    { active: 'user.username', label: 'app.user', direction: EMPTY_STRING },
    { active: 'awardsCount', label: 'app.number_of_awards', direction: EMPTY_STRING },
    { active: 'creationDate', label: 'app.add_date', direction: EMPTY_STRING },
    { active: 'lastUpdate', label: 'app.last_update', direction: EMPTY_STRING }
  ];

  totalMovies: number;
  totalRoles: number;
  totalAwards: number;
  view = View;
  pageSizeOptions = [25, 50, 100];
  person = signal<Person>(null);
  editMode = false;
  personType = PersonType;

  constructor(
    private dialog: MatDialog,
    public movieService: MovieService,
    public personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => this.personService.getById(+params.get('id'))),
      catchError(error => {
        console.error('Erreur lors de la récupération de la personne:', error);
        return of(null); // Retourne un observable avec null en cas d'erreur
      })
    ).pipe(
      filter(person => !!person), // Empêche d'exécuter la requête si `person` est null
    ).subscribe(result => this.person.set(result));
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTab$.next(event.index);
  }

  onFilter(event: Criterias) {
    this.moviesSearchConfig$.next(
      {
        ...this.moviesSearchConfig$.value,
        page: 0,
        criterias: event
      }
    );
  }

  onSwitchView(view: View) {
    this.moviesSearchConfig$.next(
      {
        ...this.moviesSearchConfig$.value,
        page: 0,
        view: view
      }
    );
  }

  onSortMovies(event: SortOption) {
    if (this.moviesSearchConfig$.value.view == View.TABLE) {
      this.moviesPaginator.firstPage();
    }

    this.updateSearchConfig({ page: 0, sort: event.active, direction: event.direction });
  }

  onSortRoles(event: SortOption) {
    this.rolesSearchConfig$.next(
      {
        ...this.rolesSearchConfig$.value,
        page: 0,
        sort: event.active,
        direction: event.direction
      }
    );
    this.rolesPaginator.firstPage();
  }

  onSearch(event: string) {
    if (typeof event === 'string') {
      this.updateSearchConfig({ page: 0, term: event?.trim() });
    }
  }

  onScroll() {
    this.updateSearchConfig({ page: this.moviesSearchConfig$.value.page + 1 });
  }

  onPageChange(event: PageEvent) {
    this.updateSearchConfig({ page: event.pageIndex, size: event.pageSize });
  }

  onDeleteCategory(category: Category) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.moviesSearchConfig$.value.criterias,
          categories: this.moviesSearchConfig$.value.criterias.categories.filter(c => c.id != category.id)
        }
      }
    );
  }

  onDeleteCountry(country: Country) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.moviesSearchConfig$.value.criterias,
          countries: this.moviesSearchConfig$.value.criterias.countries.filter(c => c.id != country.id)
        }
      }
    );
  }

  onDeleteUser(user: User) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.moviesSearchConfig$.value.criterias,
          users: this.moviesSearchConfig$.value.criterias.users.filter(u => u.id != user.id)
        }
      }
    );
  }

  private updateSearchConfig(newConfig: Partial<SearchConfig>) {
    this.moviesSearchConfig$.next(
      {
        ...this.moviesSearchConfig$.value,
        ...newConfig
      }
    );
  }

  cancel() {
    this.editMode = false;
    this.selectedTab$.next(0);
  }

  save(event: Person) {
    this.person.set(event);
    this.editMode = false;
    this.selectedTab$.next(0);
  }

  deletePerson() {
    this.dialog.open(ConfirmationDialogComponent, {
      minWidth: '30vw',  // Définit la largeur à 30% de l'écran
      data: {
        title: this.translate.instant('app.confirm'),
        message: this.translate.instant('app.confirm_delete_message', { data: this.person().name })
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.personService.delete(this.person().id).subscribe(
          {
            next: () => {
              this.snackBar.open(this.translate.instant('app.delete_success_message', { data: this.person().name }), this.translate.instant('app.close'), { duration: DURATION });
              this.router.navigateByUrl('persons');
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
