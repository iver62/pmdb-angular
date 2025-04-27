import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { MusicianService } from '../../services';

@Component({
  selector: 'app-musicians',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="musicianService.getCountries" [personService]="musicianService" viewTitle="app.musicians" cookieName="musicians-config"></app-persons>'
})
export class MusiciansComponent {

  constructor(public musicianService: MusicianService) { }

}
