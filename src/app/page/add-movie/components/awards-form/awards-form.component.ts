import { AsyncPipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../../../app.component';
import { MultiselectComponent } from "../../../../components";
import { DelayedInputDirective } from '../../../../directives';
import { SearchConfig } from '../../../../models';
import { AwardService, MovieService } from '../../../../services';
import { HttpUtils } from '../../../../utils';

@Component({
  selector: 'app-awards-form',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MultiselectComponent,
    NgPipesModule,
    ReactiveFormsModule,
    TranslatePipe,
    MultiselectComponent
  ],
  templateUrl: './awards-form.component.html',
  styleUrl: './awards-form.component.scss'
})
export class AwardsFormComponent {

  form = input.required<FormGroup>();
  movieId = input.required<number>();

  awardsSearchConfig$ = new BehaviorSubject<SearchConfig>(
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

  ceremonies$ = this.awardsSearchConfig$.pipe(
    switchMap(config => this.awardService.getCeremonies(config.page, config.size, config.term)
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

  get formArray() {
    return this.form()?.get('awards') as FormArray;
  }

  getPersonsFormControl(award: any) {
    return award.get('persons') as FormControl;
  }

  totalCeremonies: number;
  private loadedCeremonies = 0;
  private isLoadingMoreCeremonies = false;

  totalPersons: number;
  private loadedPersons = 0;
  private isLoadingMorePersons = false;

  constructor(
    private awardService: AwardService,
    private fb: FormBuilder,
    private movieService: MovieService
  ) {
    effect(() => {
      if (this.formArray?.length < 1) {
        this.addAward();
      }
    });
  }

  onSearch(event: string) {
    this.awardsSearchConfig$.next({ ...this.awardsSearchConfig$.value, page: 0, term: event.trim() });
  }

  selectAward(event: MatAutocompleteSelectedEvent) { }

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
}
