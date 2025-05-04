import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { User } from '../../models';
import { AuthService } from '../../services';

@Component({
  selector: 'app-user-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {

  duration = 5000;
  editMode = false;

  readonly form = new FormGroup(
    {
      id: new FormControl<string>(this.data?.id, Validators.required),
      username: new FormControl<string>(this.data?.username, Validators.required),
      firstName: new FormControl<string>(this.data?.firstName, Validators.required),
      lastName: new FormControl<string>(this.data?.lastName, Validators.required),
      email: new FormControl<string>(this.data?.email, [Validators.required, Validators.email]),
      emailVerified: new FormControl<boolean>(this.data?.emailVerified, Validators.required)
    }
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  get usernameFormCtrl() {
    return this.form.get('username');
  }

  get firstnameFormCtrl() {
    return this.form.get('firstName');
  }

  get lastnameFormCtrl() {
    return this.form.get('lastName');
  }

  get emailFormCtrl() {
    return this.form.get('email');
  }

  saveUser() {
    this.authService.updateUser({ ...this.form.value }).subscribe(
      {
        next: result => {
          this.data = result;
          this.editMode = false;
          this.snackBar.open(this.translate.currentLang == 'en' ? 'Profile updated successfully' : 'Profil modifié avec succés', 'Close', { duration: this.duration });
        },
        error: e => {
          console.error(e);
          this.snackBar.open(this.translate.currentLang == 'en' ? 'Error updating profile' : 'Erreur lors de la modification du profil', 'Error', { duration: this.duration });
        }
      }
    )
  }

  resetPassword(id: string) {
    return this.authService.resetPassword(id).subscribe({
      next: () => this.snackBar.open(this.translate.currentLang == 'en' ? 'Reset email sent!' : 'Email de réinitialisation envoyé avec succés', 'Close', { duration: this.duration }),
      error: e => {
        console.error(e);
        this.snackBar.open(e.error, 'Fermer', { duration: this.duration });
      }
    });
  }
}
