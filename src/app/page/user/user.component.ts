import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  styleUrl: './user.component.scss'
})
export class UserComponent {

  user: User;
  duration = 5000;
  editMode = false;
  form: FormGroup;
  selectedSection: 'profile' | 'security' = 'profile';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
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
    this.form.patchValue(this.user);
  }

  saveUser() {
    this.authService.updateUser({ ...this.form.value }).subscribe(
      {
        next: result => {
          this.snackBar.open(this.translate.instant('app.profile_updated_success'), this.translate.instant('app.close'), { duration: this.duration });
          this.user = result;
          this.editMode = false;
        },
        error: e => {
          console.error(e);
          this.snackBar.open(this.translate.instant('app.error_updating_profile'), this.translate.instant('app.close'), { duration: this.duration });
        }
      }
    )
  }

  resetPassword(id: string) {
    return this.authService.resetPassword(id).subscribe({
      next: () => this.snackBar.open(this.translate.instant('app.reset_email_sent'), this.translate.instant('app.close'), { duration: this.duration }),
      error: e => {
        console.error(e);
        this.snackBar.open(this.translate.instant('app.error_reset_email'), this.translate.instant('app.close'), { duration: this.duration });
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group(
      {
        id: [this.user?.id, Validators.required],
        username: [this.user?.username, Validators.required],
        firstName: [this.user?.firstName, Validators.required],
        lastName: [this.user?.lastName, Validators.required],
        email: [this.user?.email, [Validators.required, Validators.email]],
        emailVerified: [this.user?.emailVerified, Validators.required]
      }
    );
  }
}
