import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { ArtDirectorService } from '../../services';

@Component({
  selector: 'app-art-directors',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="artDirectorService" viewTitle="Directeurs artistiques" cookieName="art-directors-config"></app-persons>'
})
export class ArtDirectorsComponent {

  constructor(public artDirectorService: ArtDirectorService) { }

}
