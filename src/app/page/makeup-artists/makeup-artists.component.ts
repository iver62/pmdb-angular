import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { MakeupArtistService } from '../../services';

@Component({
  selector: 'app-makeup-artists',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="makeupArtistService.getCountries" [personService]="makeupArtistService" viewTitle="app.makeup_artists" cookieName="makeup-artists-config"></app-persons>'
})
export class MakeupArtistsComponent {

  constructor(public makeupArtistService: MakeupArtistService) { }

}
