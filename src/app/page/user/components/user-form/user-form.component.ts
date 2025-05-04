import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  form = input.required<FormGroup>();

  get usernameFormCtrl() {
    return this.form().get('username');
  }

  get firstnameFormCtrl() {
    return this.form().get('firstName');
  }

  get lastnameFormCtrl() {
    return this.form().get('lastName');
  }

  get emailFormCtrl() {
    return this.form().get('email');
  }

  clearUsername() {
    this.usernameFormCtrl.reset();
  }

  clearFirstname() {
    this.firstnameFormCtrl.reset();
  }

  clearLastname() {
    this.lastnameFormCtrl.reset();
  }

  clearEmail() {
    this.emailFormCtrl.reset();
  }

}
