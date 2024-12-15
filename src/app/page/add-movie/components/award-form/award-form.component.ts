
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Award } from '../../../../models';

@Component({
  selector: 'app-award-form',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule, ReactiveFormsModule],
  templateUrl: './award-form.component.html',
  styleUrl: './award-form.component.css'
})
export class AwardFormComponent {

  @Input() formGroup: FormGroup;

  @Output() remove = new EventEmitter<Award>();

  currentYear = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder) { }

  addAward() {
    const item = this.formBuilder.group(
      {
        nameCtrl: [''],
        yearCtrl: []
      }
    );
    this.awardsArray.push(item);
  }

  removeAward(index: number) {
    this.awardsArray.removeAt(index);
    this.remove.emit(this.awardsArray.at(index).value);
  }

  get awardsArray() {
    return this.formGroup.get('awardsCtrl') as FormArray;
  }

}
