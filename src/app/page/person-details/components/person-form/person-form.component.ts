import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CountrySelectorComponent, FileChooserComponent } from '../../../../components';

@Component({
  selector: 'app-person-form',
  imports: [
    CountrySelectorComponent,
    FileChooserComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css'
})
export class PersonFormComponent {

  @Input() form!: FormGroup;

  @Output() changeImage = new EventEmitter();

  get photoFormCtrl() {
    return this.form.get('photoFileName');
  }

  onSelectImage(event: File) {
    this.changeImage.emit(event);
    this.photoFormCtrl.setValue(event.name);
  }

  onDeleteImage() {
    this.changeImage.emit(null);
    this.photoFormCtrl.reset();
  }

}
