import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { VisualEffectSupervisorsService } from '../../services';

@Component({
  selector: 'app-visual-effects-supervisors',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="visualEffectsSupervisorService" viewTitle="Spécialistes effets spéciaux"></app-persons>'
})
export class VisualEffectsSupervisorsComponent {

  constructor(public visualEffectsSupervisorService: VisualEffectSupervisorsService) { }

}
