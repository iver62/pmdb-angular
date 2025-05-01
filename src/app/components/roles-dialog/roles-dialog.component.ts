import { UpperCasePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RoleRepresentation } from '../../models';

@Component({
  selector: 'app-roles-dialog',
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslatePipe,
    UpperCasePipe
  ],
  templateUrl: './roles-dialog.component.html',
  styleUrl: './roles-dialog.component.scss'
})
export class RolesDialogComponent {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      username: string,
      roles: RoleRepresentation[],
      userRoles: RoleRepresentation[]
    },
    private fb: FormBuilder
  ) {
    // Construire un Set pour comparaison rapide
    const userRoles = new Set(this.data.userRoles.map(role => role.name));

    // Construire le FormGroup
    const roleControls = this.data.roles.reduce((acc, role) => {
      acc[role.name] = new FormControl(userRoles.has(role.name));
      return acc;
    }, {} as { [key: string]: FormControl });

    this.form = this.fb.group(roleControls);
  }

}
