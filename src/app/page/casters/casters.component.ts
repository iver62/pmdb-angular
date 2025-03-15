import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { CasterService } from '../../services';

@Component({
  selector: 'app-casters',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="casterService" viewTitle="Casteurs" cookieName="casters-config"></app-persons>'
})
export class CastersComponent {

  constructor(public casterService: CasterService) { }

}