import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { VisualEffectSupervisorsService } from '../../services';

@Component({
  selector: 'app-visual-effects-supervisors',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="visualEffectsSupervisorService.getCountries" [countries$]="visualEffectsSupervisorService.getCountries" [personService]="visualEffectsSupervisorService" viewTitle="app.visual_effects_supervisors" cookieName="visual-effects-supervisors-config"></app-persons>'
})
export class VisualEffectsSupervisorsComponent {

  constructor(public visualEffectsSupervisorService: VisualEffectSupervisorsService) { }

}