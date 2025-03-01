import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { StuntmanService } from '../../services';

@Component({
  selector: 'app-stuntmen',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="stuntmanService" viewTitle="Cascadeurs"></app-persons>'
})
export class StuntmenComponent {

  constructor(public stuntmanService: StuntmanService) { }

}
