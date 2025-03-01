import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { ScreenwriterService } from '../../services';

@Component({
  selector: 'app-screenwriters',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="screenwriterService" viewTitle="Scénaristes"></app-persons>'
})
export class ScreenwritersComponent {

  constructor(public screenwriterService: ScreenwriterService) { }

}
