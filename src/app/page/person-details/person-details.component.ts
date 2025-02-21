import { Component, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, combineLatest, concatMap, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { InputComponent, MoviesListComponent } from '../../components';
import { Person, SearchConfig } from '../../models';
import { BaseService } from '../../services';
import { PersonDetailComponent } from './components';
import { PersonFormComponent } from "./components/person-form/person-form.component";

@Component({
  selector: 'app-person-details',
  imports: [
    InfiniteScrollDirective,
    InputComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MoviesListComponent,
    PersonDetailComponent,
    PersonFormComponent,
    RouterLink
  ],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.css'
})
export class PersonDetailsComponent {

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
  duration = 5000;
  service: BaseService = this.route.snapshot.data['service'];
  person = signal<Person>(null);
  editMode = false;
  form: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // ✅ Effect ensures form updates when `person` changes
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
    combineLatest([
      this.route.paramMap.pipe(
        switchMap(params => this.service.getById(+params.get('id'))),
        catchError(error => {
          console.error('Erreur lors de la récupération de la personne:', error);
          return of(null); // Retourne un observable avec null en cas d'erreur
        })
      ),
      this.searchConfig$
    ]).pipe(
      switchMap(([person, config]) =>
        forkJoin(
          {
            movies: this.service.getMovies(person.id, config.page, config.size, config.term).pipe(
              tap(response => this.total = +response.headers.get('X-Total-Count')),
              map(response => response.body ?? []),
              catchError(error => {
                console.error('Erreur lors de la récupération des films:', error);
                return of(null); // Retourne un observable avec null en cas d'erreur
              })
            ),
            countries: this.service.getCountries(person.id).pipe(
              catchError(error => {
                console.error('Erreur lors de la récupération des pays:', error);
                return of(null); // Retourne un observable avec null en cas d'erreur
              })
            )
          }
        ).pipe(
          map(result => (
            {
              ...person,
              movies: result.movies,
              countries: result.countries
            }
          ))
        )
      )
    ).subscribe(result => this.person.set(result));
  }

  onChangeImage(event: File) {
    this.selectedFile = event;
  }

  onSearch(event: string) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        term: event
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
    this.service.update(this.selectedFile, this.form.value).pipe(
      concatMap(person => this.service.getCountries(person.id).pipe(
        map(countries => (
          {
            ...person,
            countries: countries
          }
        ))
      ))
    ).subscribe(
      {
        next: (result: Person) => {
          this.person.update(current => ({
            ...current,
            name: result.name,
            photoFileName: result.photoFileName,
            dateOfBirth: result.dateOfBirth,
            dateOfDeath: result.dateOfDeath,
            countries: result.countries
          }));
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
    this.service.delete(this.person().id).subscribe(
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
