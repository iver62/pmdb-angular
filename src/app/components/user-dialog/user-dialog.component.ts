import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '../../models';

@Component({
  selector: 'app-user-dialog',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Observable<User>) { }
}
