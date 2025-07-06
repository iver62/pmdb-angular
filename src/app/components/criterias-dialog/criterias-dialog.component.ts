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
import { Category, Country, Criterias, Type, User } from '../../models';
import { CategoryService, UserService } from '../../services';
import { HttpUtils } from '../../utils';

const types = [
  {
    id: 0,
    name: PersonType.ACTOR,
    display: () => PersonType.ACTOR
  },
  {
    id: 1,
    name: PersonType.ARTIST,
    display: () => PersonType.ARTIST
  },
  {
    id: 2,
    name: PersonType.ASSISTANT_DIRECTOR,
    display: () => PersonType.ASSISTANT_DIRECTOR
  },
  {
    id: 3,
    name: PersonType.CASTER,
    display: () => PersonType.CASTER
  },
  {
    id: 4,
    name: PersonType.COMPOSER,
    display: () => PersonType.COMPOSER
  },
  {
    id: 5,
    name: PersonType.COSTUME_DESIGNER,
    display: () => PersonType.COSTUME_DESIGNER
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
    name: PersonType.SET_DESIGNER,
    display: () => PersonType.SET_DESIGNER
  },
  {
    id: 15,
    name: PersonType.SOUND_EDITOR,
    display: () => PersonType.SOUND_EDITOR
  },
  {
    id: 16,
    name: PersonType.SFX_SUPERVISOR,
    display: () => PersonType.SFX_SUPERVISOR
  },
  {
    id: 17,
    name: PersonType.STUNT_MAN,
    display: () => PersonType.STUNT_MAN
  },
  {
    id: 18,
    name: PersonType.VFX_SUPERVISOR,
    display: () => PersonType.VFX_SUPERVISOR
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
    category: new BehaviorSubject(EMPTY_STRING),
    country: new BehaviorSubject(EMPTY_STRING),
    user: new BehaviorSubject(EMPTY_STRING)
  };

  // Liste des catégories filtrées
  categories$ = this.searchTerms$.category.pipe(
    switchMap(term => this.data.categoriesObs$(term, 0, 20, 'name', 'asc', this.data.personId)
      .pipe(
        tap(response => this.totalCategories = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => response.body ?? []),
        map(categories => categories.map(c => ({ ...c, display: () => c.name }))),
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
      return this.data.countriesObs$(term, 0, 20, lang == Language.EN ? 'nomEnGb' : 'nomFrFr', lang, 'asc', this.data.personId)
        .pipe(
          tap(response => this.totalCountries = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
          map(response => response.body ?? []),
          map(countries => countries.map(c => ({ ...c, display: () => c.nomFrFr }))),
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
        map(users => users.map(u => ({ ...u, display: () => u.username }))),
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
      categories: new FormControl<Category[]>(this.data?.selectedCriterias?.categories?.map(c => ({ ...c, display: () => c.name }))),
      types: new FormControl<Type[]>(this.data?.selectedCriterias?.types?.map(t => ({ ...t, display: () => t.name }))),
      countries: new FormControl<Country[]>(this.data?.selectedCriterias?.countries?.map(c => ({ ...c, display: () => c.nomFrFr }))),
      users: new FormControl<User[]>(this.data?.selectedCriterias?.users?.map(u => ({ ...u, display: () => u.username }))),
      fromCreationDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromCreationDate),
      toCreationDate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toCreationDate),
      fromLastUpdate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.fromLastUpdate),
      toLastUpdate: new FormControl<Date | Moment>(this.data?.selectedCriterias?.toLastUpdate)
    }
  );

  totalTypes: number;
  totalCategories: number;
  totalCountries: number;
  totalUsers: number;

  constructor(
    private categoryService: CategoryService,
    private translate: TranslateService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: {
      personId: number,
      criterias: string[],
      selectedCriterias: Criterias,
      categoriesObs$: (term: string, page: number, size: number, sort: string, direction: string, id: number) => Observable<HttpResponse<Category[]>>
      countriesObs$: (term: string, page: number, size: number, sort: string, lang: string, direction: string, id: number) => Observable<HttpResponse<Country[]>>
    }
  ) { }

  // Fonction pour mettre à jour la recherche
  updateCategorySearch(term: string) {
    this.searchTerms$.category.next(term);
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
