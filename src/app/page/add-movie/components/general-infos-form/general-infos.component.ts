 import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MaterialFileInputModule } from 'ngx-custom-material-file-input';

@Component({
  selector: 'app-general-infos-form',
  standalone: true,
  imports: [MaterialFileInputModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './general-infos.component.html',
  styleUrl: './general-infos.component.css'
})
export class GeneralInfosFormComponent {

  @Input() formGroup: FormGroup;

  get titleFormCtrl() {
    return this.formGroup.controls['titleCtrl']
  }

}
