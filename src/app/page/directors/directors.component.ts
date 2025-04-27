import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { DirectorService } from '../../services';

@Component({
  selector: 'app-directors',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="directorService.getCountries" [personService]="directorService" viewTitle="app.directors" cookieName="directors-config"></app-persons>'
})
export class DirectorsComponent {

  constructor(public directorService: DirectorService) { }

}