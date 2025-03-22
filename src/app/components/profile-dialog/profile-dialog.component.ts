import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { User } from '../../models';

@Component({
  selector: 'app-profile-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.css'
})
export class ProfileDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: User) { }
}
