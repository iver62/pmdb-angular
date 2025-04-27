import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { User } from '../../models';

@Component({
  selector: 'app-user-dialog',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    TranslatePipe,
    UpperCasePipe
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Observable<User>) { }
}
