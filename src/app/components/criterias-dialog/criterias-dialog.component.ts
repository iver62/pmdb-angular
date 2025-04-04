import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Moment } from 'moment';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { DateRangePickerComponent, MultiselectComponent } from "..";
import { EMPTY_STRING } from '../../app.component';
import { Country, Criterias, Genre, User } from '../../models';
import { GenreService, UserService } from '../../services';

@Component({
  selector: 'app-criterias-dialog',
  imports: [
    AsyncPipe,
    DateRangePickerComponent,
    MatButtonModule,
    MatDialogModule,
    MultiselectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './criterias-dialog.component.html',
  styleUrl: './criterias-dialog.component.scss'
})
export class CriteriasDialogComponent {

  // Termes de recherche
  searchTerms$ = {
    country: new BehaviorSubject(EMPTY_STRING),
    genre: new BehaviorSubject(EMPTY_STRING),
    user: new BehaviorSubject(EMPTY_STRING)
  };

  // Liste des genres filtrés
  genres$ = this.searchTerms$.genre.pipe(
    switchMap(term => this.genreService.getAll(term)
      .pipe(
        map(genres => genres.map(g => new Genre(g))),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  // Liste des pays filtrés
  countries$ = this.searchTerms$.country.pipe(
    switchMap(term => this.data.countriesObs$(term)
      .pipe(
        map(countries => countries.map(c => new Country(c))),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  // Liste des utilisateurs filtrés
  users$ = this.searchTerms$.user.pipe(
    switchMap(term => this.userService.getAll(term)
      .pipe(
        map(users => users.map(u => new User(u))),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  readonly form = new FormGroup(
    {
      fromReleaseDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromReleaseDate),
      toReleaseDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toReleaseDate),
      fromBirthDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromBirthDate),
      toBirthDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toBirthDate),
      fromDeathDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromDeathDate),
      toDeathDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toDeathDate),
      genres: new FormControl<Genre[]>(this.data?.selectedCriterias?.genres?.map(g => new Genre(g))),
      countries: new FormControl<Country[]>(this.data?.selectedCriterias?.countries?.map(c => new Country(c))),
      users: new FormControl<User[]>(this.data?.selectedCriterias?.users?.map(u => new User(u))),
      fromCreationDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromCreationDate),
      toCreationDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toCreationDate),
      fromLastUpdate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromLastUpdate),
      toLastUpdate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toLastUpdate)
    }
  );

  constructor(
    private genreService: GenreService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: {
      criterias: string[],
      selectedCriterias: Criterias,
      countriesObs$: (term: string) => Observable<Country[]>
    }
  ) { }

  // Fonction pour mettre à jour la recherche
  updateGenreSearch(term: string) {
    this.searchTerms$.genre.next(term);
  }

  // Fonction pour mettre à jour la recherche
  updateCountrySearch(term: string) {
    this.searchTerms$.country.next(term);
  }

  // Fonction pour mettre à jour la recherche
  updateUserSearch(term: string) {
    this.searchTerms$.user.next(term);
  }

  eraseCriterias() {
    this.form.reset();
    this.form.markAsDirty();
  }
}
