import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { ActorService } from '../../services';

@Component({
  selector: 'app-actors',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="actorService" viewTitle="Acteurs" cookieName="actors-config"></app-persons>'
})
export class ActorsComponent {

  constructor(public actorService: ActorService) { }

}
