import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { MakeupArtistService } from '../../services';

@Component({
  selector: 'app-makeup-artists',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="makeupArtistService" viewTitle="Maquilleurs" cookieName="makeup-artists-config"></app-persons>'
})
export class MakeupArtistsComponent {

  constructor(public makeupArtistService: MakeupArtistService) { }

}
