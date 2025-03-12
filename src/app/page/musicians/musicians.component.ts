import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { MusicianService } from '../../services';

@Component({
  selector: 'app-musicians',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="musicianService" viewTitle="Musiciens" cookieName="musicians-config"></app-persons>'
})
export class MusiciansComponent {

  constructor(public musicianService: MusicianService) { }

}
