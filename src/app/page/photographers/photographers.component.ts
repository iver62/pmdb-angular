import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { PhotographerService } from '../../services';

@Component({
  selector: 'app-photographers',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="photographerService" viewTitle="Photographes" cookieName="photographers-config"></app-persons>'
})
export class PhotographersComponent {

  constructor(public photographerService: PhotographerService) { }

}
