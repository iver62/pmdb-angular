import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { TechnicalTeam } from '../../../../models';

@Component({
  selector: 'app-technical-team',
  imports: [
    MatIconModule,
    NgPipesModule,
    RouterLink,
    TranslatePipe,
    UpperCasePipe
  ],
  templateUrl: './technical-team.component.html',
  styleUrl: './technical-team.component.css'
})
export class TechnicalTeamComponent {

  @Input() technicalTeam: TechnicalTeam;
}
