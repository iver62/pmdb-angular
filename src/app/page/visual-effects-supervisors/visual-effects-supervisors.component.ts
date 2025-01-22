import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { VisualEffectSupervisorsService } from '../../services';

@Component({
  selector: 'app-visual-effects-supervisors',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './visual-effects-supervisors.component.html',
  styleUrl: './visual-effects-supervisors.component.css'
})
export class VisualEffectsSupervisorsComponent {

  visualEffectsSupervisors$ = this.visualEffectsSupervisorService.getAll();

  constructor(private visualEffectsSupervisorService: VisualEffectSupervisorsService) { }

}
