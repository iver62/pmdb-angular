import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DURATION } from '../../../../app.component';
import { CountrySelectorComponent, FileChooserComponent } from '../../../../components';
import { Person } from '../../../../models';
import { PersonService } from '../../../../services';

@Component({
  selector: 'app-person-form',
  imports: [
    CountrySelectorComponent,
    FileChooserComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.scss'
})
export class PersonFormComponent {

  person = input.required<Person>();

  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter<Person>();

  form: FormGroup;
  selectedFile: File | null = null;

  get photoFormCtrl() {
    return this.form.get('photoFileName');
  }

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
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

  onSelectImage(event: File) {
    this.photoFormCtrl.setValue(event.name);
    this.form.markAsDirty();
    this.selectedFile = event;
  }

  onDeleteImage() {
    this.photoFormCtrl.reset();
    this.form.markAsDirty();
  }

  onCancel() {
    this.cancel.emit();
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

  onSave() {
    this.personService.update(this.selectedFile, this.form.value).subscribe(
      {
        next: result => {
          this.save.emit(result);
          this.snackBar.open(`${this.person().name} modifié avec succès`, this.translate.instant('app.close'), { duration: DURATION });
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open(`Erreur lors de la modification de ${this.person().name}`, this.translate.instant('app.error'), { duration: DURATION });
        }
      }
    );
  }

}
