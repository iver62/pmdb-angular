import { AsyncPipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { DateRangePickerComponent, MultiselectComponent } from "..";
import { EMPTY_STRING } from '../../app.component';
import { Language, PersonType } from '../../enums';
import { Country, Criterias, Genre, Type, User } from '../../models';
import { GenreService, UserService } from '../../services';
import { HttpUtils } from '../../utils';

const types = [
  {
    id: 0,
    name: PersonType.ACTOR,
    display: () => PersonType.ACTOR
  },
  {
    id: 1,
    name: PersonType.ART_DIRECTOR,
    display: () => PersonType.ART_DIRECTOR
  },
  {
    id: 2,
    name: PersonType.CASTER,
    display: () => PersonType.CASTER
  },
  {
    id: 3,
    name: PersonType.COSTUMIER,
    display: () => PersonType.COSTUMIER
  },
  {
    id: 4,
    name: PersonType.DECORATOR,
    display: () => PersonType.DECORATOR
  },
  {
    id: 5,
    name: PersonType.DIALOGUE_WRITER,
    display: () => PersonType.DIALOGUE_WRITER
  },
  {
    id: 6,
    name: PersonType.DIRECTOR,
    display: () => PersonType.DIRECTOR
  },
  {
    id: 7,
    name: PersonType.EDITOR,
    display: () => PersonType.EDITOR
  },
  {
    id: 8,
    name: PersonType.HAIR_DRESSER,
    display: () => PersonType.HAIR_DRESSER
  },
  {
    id: 9,
    name: PersonType.MAKEUP_ARTIST,
    display: () => PersonType.MAKEUP_ARTIST
  },
  {
    id: 10,
    name: PersonType.MUSICIAN,
    display: () => PersonType.MUSICIAN
  },
  {
    id: 11,
    name: PersonType.PHOTOGRAPHER,
    display: () => PersonType.PHOTOGRAPHER
  },
  {
    id: 12,
    name: PersonType.PRODUCER,
    display: () => PersonType.PRODUCER
  },
  {
    id: 13,
    name: PersonType.SCREENWRITER,
    display: () => PersonType.SCREENWRITER
  },
  {
    id: 14,
    name: PersonType.SOUND_EDITOR,
    display: () => PersonType.SOUND_EDITOR
  },
  {
    id: 15,
    name: PersonType.STUNT_MAN,
    display: () => PersonType.STUNT_MAN
  },
  {
    id: 16,
    name: PersonType.VISUAL_EFFECTS_SUPERVISOR,
    display: () => PersonType.VISUAL_EFFECTS_SUPERVISOR
  }
];

@Component({
  selector: 'app-criterias-dialog',
  imports: [
    AsyncPipe,
    DateRangePickerComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MultiselectComponent,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './criterias-dialog.component.html',
  styleUrl: './criterias-dialog.component.scss'
})
export class CriteriasDialogComponent {

  // Termes de recherche
  searchTerms$ = {
    type: new BehaviorSubject(EMPTY_STRING),
    country: new BehaviorSubject(EMPTY_STRING),
    genre: new BehaviorSubject(EMPTY_STRING),
    user: new BehaviorSubject(EMPTY_STRING)
  };

  // Liste des genres filtrés
  genres$ = this.searchTerms$.genre.pipe(
    switchMap(term => this.genreService.getAll(term)
      .pipe(
        tap(response => this.totalGenres = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => response.body ?? []),
        map(genres => genres.map(g => new Genre(g))),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  types$: Observable<Type[]> = this.searchTerms$.type.pipe(
    map(term => types.filter(t => t.name.toLowerCase().includes(term.trim().toLowerCase()))),
    tap(types => this.totalTypes = types.length),
    startWith(types)
  );

  // Liste des pays filtrés
  countries$ = this.searchTerms$.country.pipe(
    switchMap(term => {
      const lang = localStorage.getItem('lang') || this.translate.defaultLang;
      return this.data.countriesObs$(term, 0, 20, lang == Language.EN ? 'nomEnGb' : 'nomFrFr', lang)
        .pipe(
          tap(response => this.totalCountries = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
          map(response => response.body ?? []),
          map(countries => countries.map(c => new Country(c))),
          catchError(() => of([])) // En cas d'erreur, retourner une liste vide
        )
    })
  );

  // Liste des utilisateurs filtrés
  users$ = this.searchTerms$.user.pipe(
    switchMap(term => this.userService.get(0, 20, term)
      .pipe(
        tap(response => this.totalUsers = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => response.body ?? []),
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
      types: new FormControl<Type[]>(this.data?.selectedCriterias?.types?.map(t => new Type(t))),
      countries: new FormControl<Country[]>(this.data?.selectedCriterias?.countries?.map(c => new Country(c))),
      users: new FormControl<User[]>(this.data?.selectedCriterias?.users?.map(u => new User(u))),
      fromCreationDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromCreationDate),
      toCreationDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toCreationDate),
      fromLastUpdate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromLastUpdate),
      toLastUpdate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toLastUpdate)
    }
  );

  totalTypes: number;
  totalGenres: number;
  totalCountries: number;
  totalUsers: number;

  constructor(
    private genreService: GenreService,
    private translate: TranslateService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: {
      criterias: string[],
      selectedCriterias: Criterias,
      countriesObs$: (term: string, page: number, size: number, sort: string, lang: string) => Observable<HttpResponse<Country[]>>
    }
  ) { }

  // Fonction pour mettre à jour la recherche
  updateGenreSearch(term: string) {
    this.searchTerms$.genre.next(term);
  }

  // Fonction pour mettre à jour la recherche
  updateTypeSearch(term: string) {
    this.searchTerms$.type.next(term);
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
