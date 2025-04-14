import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { CountrySelectorComponent, FileChooserComponent, GenreSelectorComponent } from '../../../../components';

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
    NgPipesModule,
    ReactiveFormsModule
  ],
  templateUrl: './general-infos-form.component.html',
  styleUrl: './general-infos-form.component.scss'
})
export class GeneralInfosFormComponent {

  @Input() form: FormGroup;

  @Output() selectImage = new EventEmitter<File>();

  get titleFormCtrl() {
    return this.form.get('title');
  }

  get releaseDateFormCtrl() {
    return this.form.get('releaseDate');
  }

  get posterFormCtrl() {
    return this.form.get('posterFileName');
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
