import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { TechnicalTeam } from '../../../../models';

@Component({
  selector: 'app-technical-team',
  imports: [
    MatIconModule,
    NgPipesModule,
    RouterLink
  ],
  templateUrl: './technical-team.component.html',
  styleUrl: './technical-team.component.css'
})
export class TechnicalTeamComponent {

  @Input() technicalTeam: TechnicalTeam;
}
