
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { Observable } from 'rxjs';
import { Person } from '../../../../models';

@Component({
  selector: 'app-person-form',
  imports: [CommonModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule, NgPipesModule, ReactiveFormsModule],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css'
})
export class PersonFormComponent {

  @Input() formGroup: FormGroup;
  @Input() persons$: Observable<Person[]>;

  @Output() remove = new EventEmitter<Person>();

  constructor(private formBuilder: FormBuilder) { }

  addPerson() {
    const item = this.formBuilder.group(
      {
        lastName: [''],
        firstName: [''],
        secondName: [''],
        thirdName: [''],
        pseudo: ['']
      }
    );
    this.personsArray.push(item);
  }

  removePerson(index: number) {
    this.personsArray.removeAt(index);
    this.remove.emit(this.personsArray.at(index).value);
  }

  get personsArray() {
    return this.formGroup.get('personsCtrl') as FormArray;
  }

}
