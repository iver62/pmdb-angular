import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { ScreenwriterService } from '../../services';

@Component({
  selector: 'app-screenwriters',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="screenwriterService.getCountries" [personService]="screenwriterService" viewTitle="app.screenwriters" cookieName="screenwriters-config"></app-persons>'
})
export class ScreenwritersComponent {

  constructor(public screenwriterService: ScreenwriterService) { }

}
