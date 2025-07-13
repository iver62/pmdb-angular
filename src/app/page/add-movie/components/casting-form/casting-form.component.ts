import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { DURATION, EMPTY_STRING } from '../../../../app.component';
import { AutocompleteComponent } from '../../../../components';
import { PersonType } from '../../../../enums';
import { MovieActor, Person } from '../../../../models';
import { MovieService } from '../../../../services';

@Component({
  selector: 'app-cast-form',
  imports: [
    AutocompleteComponent,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NgPipesModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './casting-form.component.html',
  styleUrl: './casting-form.component.scss'
})
export class CastingFormComponent {

  movieId = input.required<number>();
  cast = input.required<MovieActor[]>();
  cancellable = input<boolean>();

  @Output() save = new EventEmitter<MovieActor[]>();
  @Output() cancel = new EventEmitter();

  personType = PersonType;

  /**
   * Getter pour accéder au FormArray facilement
   */
  get formArray() {
    return this.form.get('actors') as FormArray;
  }

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    effect(() => {
      const actorsFormArray = this.movieService.buildActorsFormArray(this.cast());
      this.form = this.fb.group({ actors: actorsFormArray });
    });
  }

  selectActor(person: Person, index: number) {
    this.formArray.at(index).patchValue({ id: person.id, name: person.name });
  }

  /**
   * Fonction pour créer un groupe d'acteur
   */
  createActor() {
    return this.fb.group(
      {
        id: [],
        name: [EMPTY_STRING, Validators.required], // Nom de l'acteur
        role: [EMPTY_STRING, Validators.required]  // Rôle joué dans le film
      }
    );
  }

  /**
   * Ajouter un acteur au FormArray
   */
  addActor() {
    this.formArray.push(this.createActor());
  }

  /**
   * Supprimer un acteur du FormArray
   */
  removeActor(index: number) {
    this.formArray.removeAt(index);
    this.form.markAsDirty();
  }

  clearRole(index: number) {
    this.formArray.at(index).patchValue({ role: null });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
    this.formArray.updateValueAndValidity();
    this.form.markAsDirty();
  }

  cancelCastForm() {
    this.cancel.emit();
  }

  saveCast() {
    if (this.form.valid) {
      const body: MovieActor[] = this.form.get('actors').value.map(
        (ma: any, index: number) => (
          {
            id: this.cast().find(a => a.person.id == ma.id)?.id ?? null,
            person: { id: ma.id, name: ma.name },
            role: ma.role,
            rank: index
          }
        )
      );

      this.movieService.saveCast(this.movieId(), body).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.cast_update_success'), this.translate.instant('app.close'), { duration: DURATION });
            this.save.emit(result);
            this.form.markAsPristine();
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('app.cast_update_error'), this.translate.instant('app.close'), { duration: DURATION });
          }
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: DURATION });
    }
  }

}
