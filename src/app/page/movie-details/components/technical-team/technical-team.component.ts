import { Component, input } from '@angular/core';
import { PersonType } from '../../../../enums';
import { MovieTechnician, TechnicalTeam } from '../../../../models';
import { MovieService } from '../../../../services';
import { TechniciansFormComponent } from '../../../add-movie/components/technical-team-form/technicians-form/technicians-form.component';
import { TechniciansComponent } from './technicians/technicians.component';

@Component({
  selector: 'app-technical-team',
  imports: [
    TechniciansComponent,
    TechniciansFormComponent
  ],
  templateUrl: './technical-team.component.html',
  styleUrl: './technical-team.component.css'
})
export class TechnicalTeamComponent {

  movieId = input.required<number>();
  technicalTeam = input.required<TechnicalTeam>();

  personType = PersonType;

  edit = {
    producers: false,
    directors: false,
    assistantDirectors: false,
    screenwriters: false,
    composers: false,
    musicians: false,
    photographers: false,
    costumeDesigners: false,
    setDesigners: false,
    editors: false,
    casters: false,
    artists: false,
    soundEditors: false,
    vfxSupervisors: false,
    sfxSupervisors: false,
    makeupArtists: false,
    hairDressers: false,
    stuntmen: false
  }

  constructor(public movieService: MovieService) { }

  updateTechnicians(list: MovieTechnician[], type: keyof TechnicalTeam) {
    this.technicalTeam()[type] = list;
    this.edit[type] = false;
  }
}
