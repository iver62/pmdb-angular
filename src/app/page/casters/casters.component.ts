import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { CasterService } from '../../services';

@Component({
  selector: 'app-casters',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="casterService.getCountries" [personService]="casterService" viewTitle="app.casters" cookieName="casters-config"></app-persons>'
})
export class CastersComponent {

  constructor(public casterService: CasterService) { }

}