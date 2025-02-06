import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CountrySelectorComponent, FileChooserComponent, GenreSelectorComponent } from '../../../../components';
import { Genre } from '../../../../models';
import { GenreService } from '../../../../services';

@Component({
  selector: 'app-general-infos-form',
  imports: [
    CountrySelectorComponent,
    FileChooserComponent,
    GenreSelectorComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './general-infos-form.component.html',
  styleUrl: './general-infos-form.component.css'
})
export class GeneralInfosFormComponent {

  formGroupName = input.required<string>();
  form: FormGroup;
  genres: Genre[] = [];

  @Output() selectImage = new EventEmitter<File>();

  constructor(
    private genreService: GenreService,
    private rootFormGroup: FormGroupDirective
  ) {
    effect(() => this.form = this.rootFormGroup.control.get(this.formGroupName()) as FormGroup);
  }

  ngOnInit() {
    this.genreService.getAll().subscribe(result => this.genres = result);
  }

  get titleFormCtrl() {
    return this.form.get('title');
  }

  get posterFormCtrl() {
    return this.form.get('posterFileName');
  }

  addGenre(event: Genre) {
    this.genres.push(event);
  }

  onSelectImage(event: File) {
    this.posterFormCtrl.setValue(event.name);
    this.selectImage.emit(event);
  }

  onDeleteImage() {
    this.posterFormCtrl.reset();
    this.selectImage.emit(null);
  }

}
