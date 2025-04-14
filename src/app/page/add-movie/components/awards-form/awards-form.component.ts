import { AsyncPipe } from '@angular/common';
import { Component, effect, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../../../app.component';
import { DelayedInputDirective } from '../../../../directives';
import { SearchConfig } from '../../../../models';
import { AwardService } from '../../../../services';
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
    NgPipesModule,
    ReactiveFormsModule
  ],
  templateUrl: './awards-form.component.html',
  styleUrl: './awards-form.component.scss'
})
export class AwardsFormComponent {

  @Input() form: FormGroup;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'nomFrFr',
      term: EMPTY_STRING
    }
  );

  ceremonies$ = this.searchConfig$.pipe(
    switchMap(config => this.awardService.getCeremonies(config.page, config.size, config.direction, config.term)
      .pipe(
        tap(response => {
          this.isLoadingMore = false;
          this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
        }),
        map(response => response.body),
      )
    )
  );

  get formArray() {
    return this.form?.get('awards') as FormArray;
  }

  private total: number;
  private loaded = 0;
  private isLoadingMore = false;

  constructor(
    private awardService: AwardService,
    private fb: FormBuilder
  ) {
    effect(() => {
      if (this.formArray?.length < 1) {
        this.addAward();
      }
    });
  }

  onSearch(event: string) {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: event.trim() });
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
        year: [EMPTY_STRING]  // Année de la récompense
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
}
