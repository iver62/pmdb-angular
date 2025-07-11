import { Component, input } from '@angular/core';
import { PersonType } from '../../../../enums';
import { MovieTechnician, TechnicalTeam } from '../../../../models';
import { MovieService } from '../../../../services';
import { TechniciansFormComponent } from "./technicians-form/technicians-form.component";

@Component({
  selector: 'app-technical-team-form',
  imports: [TechniciansFormComponent],
  templateUrl: './technical-team-form.component.html',
  styleUrl: './technical-team-form.component.scss'
})
export class TechnicalTeamFormComponent {

  movieId = input.required<number>();
  expanded = input.required<boolean>();
  technicalTeam = input.required<TechnicalTeam>();

  personType = PersonType;

  constructor(public movieService: MovieService) { }

  updateTechnicians(list: MovieTechnician[], type: keyof TechnicalTeam) {
    this.technicalTeam()[type] = list;
  }

}
