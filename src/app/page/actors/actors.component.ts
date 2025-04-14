import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { ActorService } from '../../services';

@Component({
  selector: 'app-actors',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="actorService.getCountries" [personService]="actorService" viewTitle="Acteurs" cookieName="actors-config"></app-persons>'
})
export class ActorsComponent {

  constructor(public actorService: ActorService) { }

}
