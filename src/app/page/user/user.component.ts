import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { User } from '../../models';
import { AuthService } from '../../services';
import { UserFormComponent } from "./components";

@Component({
  selector: 'app-user',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    TranslatePipe,
    UserFormComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  user: User;
  duration = 5000;
  editMode = false;
  form: FormGroup;
  selectedSection: 'profile' | 'security' = 'profile';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.authService.loadUserProfile().subscribe(result => {
      this.user = result;
      this.buildForm();
    });
  }

  cancelForm() {
    this.editMode = false;
    this.buildForm();
  }

  saveUser() {
    this.authService.updateUser({ ...this.form.value }).subscribe(
      {
        next: result => {
          this.user = result;
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

  private buildForm() {
    this.form = new FormGroup(
      {
        id: new FormControl<string>(this.user?.id, Validators.required),
        username: new FormControl<string>(this.user?.username, Validators.required),
        firstName: new FormControl<string>(this.user?.firstName, Validators.required),
        lastName: new FormControl<string>(this.user?.lastName, Validators.required),
        email: new FormControl<string>(this.user?.email, [Validators.required, Validators.email]),
        emailVerified: new FormControl<boolean>(this.user?.emailVerified, Validators.required)
      }
    );
  }
}
