import { Component, effect, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { Observable } from 'rxjs';
import { DURATION, EMPTY_STRING } from '../../../../../app.component';
import { AutocompleteComponent } from '../../../../../components';
import { PersonType } from '../../../../../enums';
import { MovieTechnician, Person } from '../../../../../models';
import { MovieService } from '../../../../../services';

@Component({
  selector: 'app-technicians-form',
  imports: [
    AutocompleteComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NgPipesModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './technicians-form.component.html',
  styleUrl: './technicians-form.component.scss'
})
export class TechniciansFormComponent {

  @ViewChild('expansionPanel') expansionPanel!: MatExpansionPanel;

  movieId = input.required<number>();
  title = input.required<string>();
  label = input.required<string>();
  technicians = input.required<MovieTechnician[]>();
  personType = input.required<PersonType>();
  serviceCall = input.required<(movieId: number, technicians: MovieTechnician[]) => Observable<MovieTechnician[]>>();
  successMessage = input.required<string>();
  expanded = input<boolean>();
  cancellable = input<boolean>(true);

  @Output() update = new EventEmitter<MovieTechnician[]>();
  @Output() cancel = new EventEmitter();

  form: FormGroup;

  get formArray() {
    return this.form.get('technicians') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    effect(() => this.form = this.movieService.buildTechniciansForm(this.technicians()));
  }

  createTechnician() {
    return this.fb.group(
      {
        id: [],
        person: this.fb.group(
          {
            id: [],
            name: [EMPTY_STRING, Validators.required], // Nom du technicien
          }
        ),
        role: [EMPTY_STRING]  // Rôle tenu dans le film
      }
    );
  }

  selectTechnician(person: Person, index: number) {
    this.formArray.at(index).get('person').patchValue({ id: person.id, name: person.name });
  }

  clearRole(index: number) {
    this.formArray.at(index).patchValue({ role: null });
  }

  addTechnician() {
    this.formArray.push(this.createTechnician());
  }

  removeTechnician(index: number) {
    this.formArray.removeAt(index);
    this.form.markAsDirty();
  }

  saveTechnicians() {
    if (this.form.valid) {
      const technicians = this.movieService.buildMovieTechniciansArray(this.formArray);

      this.serviceCall()(this.movieId(), technicians).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant(this.successMessage()), this.translate.instant('app.close'), { duration: DURATION });
            this.update.emit(result);
            this.form.markAsPristine();
          },
          error: error => {
            console.error(error);
            this.snackBar.open(error.error, this.translate.instant('app.close'), { duration: DURATION });
          }
        }
      );
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: DURATION });
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}
