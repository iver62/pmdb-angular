import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { StuntmanService } from '../../services';

@Component({
  selector: 'app-stuntmen',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="stuntmanService.getCountries" [personService]="stuntmanService" viewTitle="Cascadeurs" cookieName="stuntmen-config"></app-persons>'
})
export class StuntmenComponent {

  constructor(public stuntmanService: StuntmanService) { }

}
