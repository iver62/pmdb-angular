import { AsyncPipe } from '@angular/common';
import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { BehaviorSubject, map, of, switchMap, tap } from 'rxjs';
import { DURATION, EMPTY_STRING } from '../../../../../app.component';
import { PersonsMultiselectComponent } from '../../../../../components';
import { DelayedInputDirective } from '../../../../../directives';
import { Ceremony, CeremonyAwards, SearchConfig } from '../../../../../models';
import { CeremonyService, MovieService } from '../../../../../services';
import { HttpUtils } from '../../../../../utils';

@Component({
  selector: 'app-ceremony-awards-form',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NgPipesModule,
    PersonsMultiselectComponent,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './ceremony-awards-form.component.html',
  styleUrl: './ceremony-awards-form.component.scss'
})
export class CeremonyAwardsFormComponent {

  movieId = input.required<number>();
  ceremonyAwards = input.required<CeremonyAwards>();
  cancellable = input<boolean>();

  form: FormGroup;

  @Output() delete = new EventEmitter();
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
    switchMap(config => !config.term.trim()
      ? of([]).pipe(tap(() => this.totalCeremonies = null))
      : this.ceremonyService.getCeremonies(config.page, config.size, config.term).pipe(
        tap(response => {
          this.isLoadingMoreCeremonies = false;
          this.totalCeremonies = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
        }),
        map(response => response.body),
      )
    )
  );

  totalCeremonies: number;
  private loadedCeremonies = 0;
  private isLoadingMoreCeremonies = false;

  constructor(
    private ceremonyService: CeremonyService,
    private fb: FormBuilder,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    effect(() => this.form = this.fb.group(
      {
        id: [this.ceremonyAwards()?.id],
        ceremony: fb.group(
          {
            id: [this.ceremonyAwards().ceremony?.id ?? null],
            name: [this.ceremonyAwards().ceremony?.name ?? null, Validators.required]
          }
        ),
        awards: this.movieService.buildAwardsFormArray(this.ceremonyAwards().awards ?? [])
      }
    ));
  }

  get ceremonyFormGroup() {
    return this.form.get('ceremony') as FormGroup;
  }

  get awardsCtrl() {
    return this.form.get('awards') as FormArray;
  }

  getPersonsFormControl(award: any) {
    return award.get('persons') as FormControl;
  }

  onSearch(event: string) {
    this.ceremoniesSearchConfig$.next({ ...this.ceremoniesSearchConfig$.value, page: 0, term: event.trim() });
  }

  selectCeremony(event: MatAutocompleteSelectedEvent) {
    const selected: Ceremony = event.option.value;

    // Mise à jour du FormGroup imbriqué "ceremony"
    this.ceremonyFormGroup.patchValue({
      id: selected.id,
      name: selected.name
    });
  }

  /**
   * Fonction pour créer un groupe d'acteur
   */
  createAward() {
    return this.fb.group(
      {
        name: [null, Validators.required], // Nom de la récompense
        year: [],  // Année de la récompense
        persons: []  // Personnes concernées par la récompense
      }
    );
  }

  /**
   * Ajouter une récompense au FormArray
   */
  addAward() {
    this.awardsCtrl.push(this.createAward());
  }

  /**
   * Supprimer une récompense du FormArray
   */
  removeAward(index: number) {
    const awards = this.awardsCtrl;
    if (index >= 0 && index < awards.length) {
      awards.removeAt(index);
      awards.updateValueAndValidity()
    }
    this.form.markAsDirty();
  }

  clearCeremony() {
    this.ceremonyFormGroup.patchValue({
      id: null,
      name: null
    });
    this.ceremoniesSearchConfig$.next(
      {
        page: 0,
        size: 20,
        term: EMPTY_STRING
      }
    )
  }

  clearName(index: number) {
    this.awardsCtrl.at(index).patchValue({ name: null })
  }

  clearYear(index: number) {
    this.awardsCtrl.at(index).patchValue({ year: null })
  }

  updatePersonSearch(term: string) {
    this.personsSearchConfig$.next({ ...this.personsSearchConfig$.value, page: 0, term: term });
  }

  saveAwards() {
    if (this.form.valid) {
      this.movieService.saveAwards(this.movieId(), this.form.value).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.awards_added_success'), this.translate.instant('app.close'), { duration: DURATION });
            this.form.markAsPristine();
            this.save.emit(result);
          },
          error: error => {
            console.error(error);
            this.snackBar.open(error, this.translate.instant('app.close'), { duration: DURATION });
          }
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: DURATION });
    }
  }

  deleteCeremony() {
    this.delete.emit();
  }

  cancelForm() {
    this.cancel.emit();
  }

}
