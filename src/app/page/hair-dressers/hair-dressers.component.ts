import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { HairDresserService } from '../../services';

@Component({
  selector: 'app-hair-dressers',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="hairDresserService" viewTitle="Coiffeurs" cookieName="hair-dressers-config"></app-persons>'
})
export class HairDressersComponent {

  constructor(public hairDresserService: HairDresserService) { }

}
