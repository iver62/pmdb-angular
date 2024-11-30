
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialFileInputModule } from 'ngx-custom-material-file-input';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [FormsModule, MaterialFileInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css'
})
export class RoleFormComponent {

  @Input() formGroup: FormGroup;

  srcResult: string;

  constructor(private formBuilder: FormBuilder) { }

  addRole() {
    const item = this.formBuilder.group(
      {
        lastNameCtrl: [''],
        firstNameCtrl: [''],
        secondNameCtrl: [''],
        thirdNameCtrl: [''],
        pseudoCtrl: [''],
        roleCtrl: ['']
      }
    );
    this.rolesArray.push(item);
  }

  removeRole(index: number) {
    this.rolesArray.removeAt(index)
  }

  get rolesArray() {
    return this.formGroup.get('rolesCtrl') as FormArray;
  }

}
