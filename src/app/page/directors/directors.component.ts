import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { DirectorService } from '../../services';

@Component({
  selector: 'app-directors',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="directorService" viewTitle="Réalisateurs"></app-persons>'
})
export class DirectorsComponent {

  constructor(public directorService: DirectorService) { }

}