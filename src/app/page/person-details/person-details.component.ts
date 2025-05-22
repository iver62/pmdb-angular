import { AsyncPipe } from '@angular/common';
import { Component, effect, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, filter, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { MoviesListComponent, MoviesTableComponent, ToolbarComponent } from '../../components';
import { View } from '../../enums';
import { Criterias, Movie, Person, SearchConfig, SortOption } from '../../models';
import { PersonService } from '../../services';
import { HttpUtils } from '../../utils';
import { PersonDetailComponent, PersonFormComponent } from './components';

@Component({
  selector: 'app-person-details',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MoviesListComponent,
    MoviesTableComponent,
    PersonDetailComponent,
    PersonFormComponent,
    RouterLink,
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.scss'
})
export class PersonDetailsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      sort: 'title',
      direction: 'asc',
      term: EMPTY_STRING,
      criterias: {},
      view: View.CARDS
    }
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

  total: number;
  view = View;
  pageSizeOptions = [25, 50, 100];
  duration = 5000;
  person = signal<Person>(null);
  editMode = false;
  form: FormGroup;
  selectedFile: File | null = null;

  sorts$: Observable<SortOption[]> = this.searchConfig$.pipe(
    map(config =>
      this.sortOptions.map(option => (
        {
          ...option,
          direction: option.active === config.sort ? config.direction : EMPTY_STRING // Met à jour la direction du tri
        }
      ))
    )
  );

  movies$ = this.searchConfig$.pipe(
    filter(() => !!this.person()),
    switchMap(config =>
      this.personService.getMovies(this.person().id, config.page, config.size, config.term, config.sort, config.direction, config.criterias).pipe(
        tap(response => this.total = +response.headers.get(HttpUtils.X_TOTAL_COUNT)),
        map(response => response.body ?? []),
        catchError(error => {
          console.error('Erreur lors de la récupération des films:', error);
          return of(null); // Retourne un observable avec null en cas d'erreur
        })
      )
    ),
    scan((acc: Movie[], result: Movie[]) => this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == View.TABLE // Concatène les nouvelles données
      ? result
      : acc.concat(result), []
    )
  );

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Effect ensures form updates when `person` changes
    effect(() => {
      if (this.person()) {
        this.form = this.fb.group({
          id: [this.person()!.id],
          name: [this.person()!.name, Validators.required],
          dateOfBirth: [this.person()!.dateOfBirth],
          dateOfDeath: [this.person()!.dateOfDeath],
          photoFileName: [this.person()!.photoFileName],
          creationDate: [this.person()!.creationDate],
          countries: [this.person()!.countries]
        });
      }
    });
  }

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

  onChangeImage(event: File) {
    this.selectedFile = event;
  }

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

  cancel() {
    this.editMode = false;
    this.form.patchValue(
      {
        name: this.person().name,
        photoFileName: this.person().photoFileName,
        dateOfBirth: this.person().dateOfBirth,
        dateOfDeath: this.person().dateOfDeath,
        countries: this.person().countries
      }
    );
  }

  save() {
    this.personService.update(this.selectedFile, this.form.value).subscribe(
      {
        next: (result: Person) => {
          this.person.set(result);
          this.editMode = false;
          this.snackBar.open(`${this.person().name} modifié avec succès`, 'Done', { duration: this.duration });
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open(`Erreur lors de la modification de ${this.person().name}`, 'Error', { duration: this.duration });
        }
      }
    );
  }

  deletePerson() {
    this.personService.delete(this.person().id).subscribe(
      {
        next: (result: boolean) => {
          this.snackBar.open(`${this.person.name} supprimé avec succès`, 'Done', { duration: this.duration });
          this.router.navigateByUrl(this.route.snapshot.url.at(0)?.path);
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open(`Erreur lors de la suppression de ${this.person().name}`, 'Error', { duration: this.duration });
        }
      }
    );
  }
}
