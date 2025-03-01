import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { MakeupArtistService } from '../../services';

@Component({
  selector: 'app-makeup-artists',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="makeupArtistService" viewTitle="Maquilleurs"></app-persons>'
})
export class MakeupArtistsComponent {

  constructor(public makeupArtistService: MakeupArtistService) { }

}
