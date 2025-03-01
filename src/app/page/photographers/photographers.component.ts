import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { PhotographerService } from '../../services';

@Component({
  selector: 'app-photographers',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="photographerService" viewTitle="Photographes"></app-persons>'
})
export class PhotographersComponent {

  constructor(public photographerService: PhotographerService) { }

}
