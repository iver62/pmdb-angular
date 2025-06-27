import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../../../app.component';
import { CeremonyAwards, SearchConfig } from '../../../../models';
import { AwardService, CeremonyService, MovieService } from '../../../../services';
import { HttpUtils } from '../../../../utils';
import { CeremonyAwardsFormComponent } from "./ceremony-awards-form/ceremony-awards-form.component";

@Component({
  selector: 'app-awards-form',
  imports: [
    CeremonyAwardsFormComponent,
    MatAutocompleteModule,
    TranslatePipe
  ],
  templateUrl: './awards-form.component.html',
  styleUrl: './awards-form.component.scss'
})
export class AwardsFormComponent {

  duration = 5000;
  // form = input.required<FormGroup>();
  movieId = input.required<number>();
  ceremoniesAwards = input<CeremonyAwards[]>();
  cancellable = input<boolean>(true);

  @Output() save = new EventEmitter<CeremonyAwards>();
  @Output() cancel = new EventEmitter();

  ceremoniesSearchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      term: EMPTY_STRING
    }
  );

  personsSearchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      term: EMPTY_STRING
    }
  );

  ceremonies$ = this.ceremoniesSearchConfig$.pipe(
    switchMap(config => this.ceremonyService.getCeremonies(config.page, config.size, config.term)
      .pipe(
        tap(response => {
          this.isLoadingMoreCeremonies = false;
          this.totalCeremonies = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
        }),
        map(response => response.body),
      )
    )
  );

  persons$ = this.personsSearchConfig$.pipe(
    switchMap(config => this.movieService.getPersonsByMovie(this.movieId(), config.page, config.size, config.term)
      .pipe(
        tap(response => {
          this.isLoadingMorePersons = false;
          this.totalPersons = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
        }),
        map(response => response.body),
        map(persons => persons?.map(p => ({ ...p, display: () => p.name })))
      )
    )
  );

  form: FormGroup = this.fb.group(
    {
      ceremoniesAwards: this.fb.array<CeremonyAwards>([])
    }
  );

  localCeremoniesAwards: CeremonyAwards[] = [];

  get formArray() {
    return this.form?.get('ceremoniesAwards') as FormArray;
  }

  totalCeremonies: number;
  private loadedCeremonies = 0;
  private isLoadingMoreCeremonies = false;

  totalPersons: number;
  private loadedPersons = 0;
  private isLoadingMorePersons = false;

  constructor(
    private awardService: AwardService,
    private ceremonyService: CeremonyService,
    private fb: FormBuilder,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    effect(() => this.localCeremoniesAwards = this.ceremoniesAwards() ?? []);
  }

  addCeremony() {
    this.localCeremoniesAwards.push(
      {
        ceremony: null,
        awards: []
      }
    );
  }

  getPersonsFormControl(award: any) {
    return award.get('persons') as FormControl;
  }

  onSearch(event: string) {
    this.ceremoniesSearchConfig$.next({ ...this.ceremoniesSearchConfig$.value, page: 0, term: event.trim() });
  }

  selectCeremony(event: MatAutocompleteSelectedEvent) { }

  /**
   * Fonction pour créer un groupe d'acteur
   */
  createAward() {
    return this.fb.group(
      {
        ceremony: [EMPTY_STRING, Validators.required], // Cérémonie de la récompense
        name: [EMPTY_STRING, Validators.required], // Nom de la récompense
        year: [EMPTY_STRING],  // Année de la récompense
        persons: []  // Personnes concernées par la récompense
      }
    );
  }

  /**
   * Ajouter une récompense au FormArray
   */
  addAward() {
    this.formArray.push(this.createAward());
  }

  /**
   * Supprimer une récompense du FormArray
   */
  removeAward(index: number) {
    const awards = this.formArray;
    if (index >= 0 && index < awards.length) {
      awards.removeAt(index);
      awards.updateValueAndValidity()
    }
  }

  clearCeremony(index: number) {
    this.formArray.at(index).patchValue({ ceremony: null })
  }

  clearName(index: number) {
    this.formArray.at(index).patchValue({ name: null })
  }

  clearYear(index: number) {
    this.formArray.at(index).patchValue({ year: null })
  }

  updatePersonSearch(term: string) {
    this.personsSearchConfig$.next({ ...this.personsSearchConfig$.value, page: 0, term: term });
  }

  saveAwards() {
    if (this.form.valid) {
      this.movieService.saveAwards(this.movieId(), this.form.value['awards']).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.awards_added_success'), this.translate.instant('app.close'), { duration: this.duration });
            this.save.emit(result);
          },
          error: error => {
            console.error(error);
            this.snackBar.open(error, this.translate.instant('app.close'), { duration: this.duration });
          }
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: this.duration });
    }
  }

  deleteCeremonyAwards(index: number) {
    this.localCeremoniesAwards.splice(index, 1);
  }
}
